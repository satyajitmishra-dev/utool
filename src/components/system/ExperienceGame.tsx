"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trophy, Play, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export interface ExperienceGameProps {
  className?: string;
  isOffline?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: "pdf" | "tool" | "bug";
}

export function ExperienceGame({ className, isOffline = false }: ExperienceGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Achievements list
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "explorer", name: "Lost Explorer", desc: "Initiated the system state interface", unlocked: true, icon: "🧭" },
    { id: "survivor", name: "Offline Survivor", desc: "Played the mini-game during offline mode", unlocked: false, icon: "🏕️" },
    { id: "hunter", name: "Tool Hunter", desc: "Scored over 100 points in Tool Catch", unlocked: false, icon: "🎒" },
    { id: "curious", name: "Curious User", desc: "Unlocked the secret Konami Code easter egg", unlocked: false, icon: "👾" },
  ]);

  // Player position
  const playerRef = useRef({ x: 150, width: 60, height: 16 });
  const objectsRef = useRef<GameObject[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Sync High Score and Achievements on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load High Score
    const savedHighScore = localStorage.getItem("utool_game_highscore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    // Load achievements
    const savedAchievements = localStorage.getItem("utool_game_achievements");
    if (savedAchievements) {
      try {
        const parsed: Record<string, boolean> = JSON.parse(savedAchievements);
        setAchievements((prev) =>
          prev.map((a) => ({
            ...a,
            unlocked: parsed[a.id] !== undefined ? parsed[a.id] : a.unlocked,
          }))
        );
      } catch {
        // ignore
      }
    }

    // Trigger explorer achievement
    unlockAchievement("explorer");
  }, []);

  // Unlock an achievement and save to local storage
  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const alreadyUnlocked = prev.find((a) => a.id === id)?.unlocked;
      if (alreadyUnlocked) return prev;

      const updated = prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a));
      const statusMap = updated.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.unlocked }), {});
      
      localStorage.setItem("utool_game_achievements", JSON.stringify(statusMap));
      
      const unlockedItem = prev.find((a) => a.id === id);
      if (unlockedItem) {
        toast(`Achievement Unlocked: ${unlockedItem.name}!`, { icon: unlockedItem.icon });
      }
      
      return updated;
    });
  };

  // 2. Main Game Loop (only active when "playing")
  useEffect(() => {
    if (gameState !== "playing" || !canvasRef.current) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = Math.min(rect.width, 420);
        canvas.height = 200;
        playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
      }
    };
    resizeCanvas();

    objectsRef.current = [];
    let gameScore = 0;
    setScore(0);

    let spawnTimer = 0;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines (retro arcade style)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Toolbox Player
      ctx.fillStyle = "hsl(238, 75%, 57%)"; // Indigo brand color
      // Round rect player toolbox
      ctx.beginPath();
      ctx.roundRect(
        playerRef.current.x,
        canvas.height - 24,
        playerRef.current.width,
        playerRef.current.height,
        [4]
      );
      ctx.fill();
      
      // Draw toolbox handle
      ctx.strokeStyle = "hsl(258, 60%, 55%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        playerRef.current.x + playerRef.current.width / 2,
        canvas.height - 24,
        12,
        Math.PI,
        0
      );
      ctx.stroke();

      // Spawn falling objects
      spawnTimer++;
      if (spawnTimer > 45) {
        spawnTimer = 0;
        const types: ("pdf" | "tool" | "bug")[] = ["pdf", "tool", "bug", "pdf", "tool"];
        const type = types[Math.floor(Math.random() * types.length)];
        objectsRef.current.push({
          x: Math.random() * (canvas.width - 20),
          y: -20,
          width: 16,
          height: 16,
          speed: Math.random() * 2.5 + 2,
          type,
        });
      }

      // Update and Draw objects
      objectsRef.current.forEach((obj, index) => {
        obj.y += obj.speed;

        // Collision Check (Intersection with Player)
        const hitPlayer = 
          obj.y + obj.height >= canvas.height - 24 &&
          obj.y <= canvas.height - 24 + playerRef.current.height &&
          obj.x + obj.width >= playerRef.current.x &&
          obj.x <= playerRef.current.x + playerRef.current.width;

        if (hitPlayer) {
          if (obj.type === "pdf") {
            gameScore += 20;
            setScore(gameScore);
          } else if (obj.type === "tool") {
            gameScore += 10;
            setScore(gameScore);
          } else if (obj.type === "bug") {
            // GameOver on virus catch
            setGameState("gameover");
            return;
          }
          // Remove hit object
          objectsRef.current.splice(index, 1);
          return;
        }

        // Out of bounds check
        if (obj.y > canvas.height) {
          objectsRef.current.splice(index, 1);
          return;
        }

        // Draw Object
        if (obj.type === "pdf") {
          ctx.fillStyle = "#ef4444"; // Red for PDF page
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("PDF", obj.x + 1, obj.y + 11);
        } else if (obj.type === "tool") {
          ctx.fillStyle = "#6366f1"; // Indigo gear/wrench
          ctx.beginPath();
          ctx.arc(obj.x + 8, obj.y + 8, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "9px sans-serif";
          ctx.fillText("⚙️", obj.x + 2, obj.y + 11);
        } else if (obj.type === "bug") {
          ctx.fillStyle = "#f59e0b"; // Warning insect / bug
          ctx.beginPath();
          ctx.arc(obj.x + 8, obj.y + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000000";
          ctx.font = "9px sans-serif";
          ctx.fillText("👾", obj.x + 2, obj.y + 12);
        }
      });

      // Continue game loop
      if (gameState === "playing") {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState]);

  // 3. Process achievements and high scores on GameOver
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("utool_game_highscore", score.toString());
        toast.success("New High Score achieved!", { icon: "🏆" });
      }

      // Check Achievements
      if (score >= 100) {
        unlockAchievement("hunter");
      }
      if (isOffline) {
        unlockAchievement("survivor");
      }

      // Check Konami Code
      if (typeof window !== "undefined" && (window as any).__KONAMI_UNLOCKED__) {
        unlockAchievement("curious");
      }
    }
  }, [gameState, score, highScore, isOffline]);

  // Steer player with mouse move / touch drag
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const newX = relativeX - playerRef.current.width / 2;
    playerRef.current.x = Math.max(0, Math.min(canvasRef.current.width - playerRef.current.width, newX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const newX = relativeX - playerRef.current.width / 2;
    playerRef.current.x = Math.max(0, Math.min(canvasRef.current.width - playerRef.current.width, newX));
  };

  // Steering with keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing" || !canvasRef.current) return;

      const step = 20;
      if (e.key === "ArrowLeft") {
        playerRef.current.x = Math.max(0, playerRef.current.x - step);
      } else if (e.key === "ArrowRight") {
        playerRef.current.x = Math.min(canvasRef.current.width - playerRef.current.width, playerRef.current.x + step);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Hook Konami Code listener to unlock the Curious achievement
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkKonamiInterval = setInterval(() => {
      if ((window as any).__UTOOL_KONAMI__) {
        unlockAchievement("curious");
        clearInterval(checkKonamiInterval);
      }
    }, 1000);

    return () => clearInterval(checkKonamiInterval);
  }, []);

  const startGame = () => {
    setGameState("playing");
  };

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col gap-4 text-center select-none animate-fade-in", className)}>
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/45 shadow-sm backdrop-blur-md">
        
        {/* Game Title & Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
            <Trophy size={12} className="text-amber-500" />
            Arcade Sandbox
          </span>
          <div className="flex items-center gap-3 text-[10px] font-bold font-mono">
            <span className="text-muted-foreground">SCORE: {score}</span>
            <span className="text-amber-500">HI: {highScore}</span>
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="relative w-full h-[200px] rounded-xl overflow-hidden bg-black/40 dark:bg-black/60 border border-border/40 flex items-center justify-center">
          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-card/50 backdrop-blur-xs z-10">
              <h4 className="font-semibold text-xs text-foreground mb-1">Tool Collector Game</h4>
              <p className="text-[10px] text-muted-foreground max-w-[280px] mb-3.5 leading-normal">
                Catch falling PDFs (Red) and Gears (Blue) in your toolbox. Avoid Red Virus Bugs!
              </p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-white text-xs font-bold px-4 py-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md shadow-primary/10 cursor-pointer"
              >
                <Play size={10} />
                Play Game
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/80 z-10">
              <h4 className="font-bold text-red-500 text-sm mb-1">Virus Glitched!</h4>
              <p className="text-xs text-muted-foreground mb-3 font-mono">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-red-600 to-rose-700 text-white text-xs font-bold px-4 py-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md shadow-red-500/10 cursor-pointer"
              >
                <RotateCcw size={10} />
                Restart Catch
              </button>
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Mobile controls hints */}
        {gameState === "playing" && (
          <div className="mt-2 text-[9px] text-muted-foreground italic font-medium">
            Drag mouse/finger or use Left/Right arrows to steer the toolbox.
          </div>
        )}
      </div>

      {/* Achievements Drawer */}
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/25 backdrop-blur-xs flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-500" />
          Game Achievements
        </h5>
        
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-2 rounded-xl border flex items-center gap-2 text-left transition-colors",
                item.unlocked
                  ? "bg-emerald-500/5 border-emerald-500/15"
                  : "bg-muted/20 border-border/40 opacity-50"
              )}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-foreground block truncate">
                  {item.name}
                </span>
                <span className="text-[8px] text-muted-foreground block truncate">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ExperienceGame;
