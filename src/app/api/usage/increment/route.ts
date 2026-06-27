import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { adminDb } from "@/lib/firebase-admin";
import { getToolBySlug } from "@/config/tool-registry";

export async function POST(req: NextRequest) {
  try {
    const { identifier, toolId, status, errorMessage } = await req.json();
    if (!identifier) {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    const isGuest = identifier.startsWith("anon_");
    const redisKey = `user:usage:${identifier}`;
    const isSuccess = status !== "failed";

    let newCount = 0;
    if (isSuccess) {
      const exists = await redis.exists(redisKey);
      newCount = await redis.incr(redisKey);
      
      const now = new Date();
      const startOfNextDay = new Date();
      startOfNextDay.setUTCHours(24, 0, 0, 0);
      const secondsUntilMidnight = Math.max(1, Math.floor((startOfNextDay.getTime() - now.getTime()) / 1000));

      if (!exists) {
        await redis.expire(redisKey, secondsUntilMidnight);
      }
    } else {
      // If failed, read existing count from Redis (or 0 if key doesn't exist)
      newCount = (await redis.get<number>(redisKey)) || 0;
    }

    const now = new Date();

    // 3. Non-blocking Async Updates in Firestore
    const updateFirestore = async () => {
      try {
        const todayStr = now.toISOString().split("T")[0];
        
        // Log individual usage event for analytics (always logged)
        const logData: Record<string, any> = {
          identifier,
          type: isGuest ? "guest" : "user",
          toolId: toolId || "unknown",
          status: status || "success",
          timestamp: now,
        };
        if (errorMessage) {
          logData.errorMessage = errorMessage;
        }
        await adminDb.collection("global_usage_logs").add(logData);

        // Log individual usage event for dashboard history
        const transactionData: Record<string, any> = {
          userId: identifier,
          toolId: toolId || "unknown",
          toolName: toolId ? (getToolBySlug(toolId)?.name || toolId) : "Unknown Tool",
          status: status || "success",
          creditsUsed: 1,
          timestamp: now,
        };
        await adminDb.collection("usage_transactions").add(transactionData);

        // Sync aggregates ONLY on success
        if (!isGuest && isSuccess) {
          const userRef = adminDb.collection("users").doc(identifier);
          let triggerReferralBonus = false;
          let referrerUid = "";

          await adminDb.runTransaction(async (transaction) => {
            const userSnap = await transaction.get(userRef);
            if (userSnap.exists) {
              const userData = userSnap.data();
              const dailyUsageDate = userData?.dailyUsageDate || "";
              const currentDailyCount = dailyUsageDate === todayStr ? (userData?.dailyUsageCount || 0) : 0;
              const isFirstSuccessfulUse = (userData?.totalLifetimeUsage || 0) === 0;

              const userUpdate: Record<string, any> = {
                totalLifetimeUsage: (userData?.totalLifetimeUsage || 0) + 1,
                dailyUsageDate: todayStr,
                dailyUsageCount: currentDailyCount + 1,
                lastActiveAt: now,
                updatedAt: now,
              };

              if (toolId) {
                userUpdate.lastUsedTool = toolId;
                userUpdate[`toolUsageCounts.${toolId}`] = (userData?.toolUsageCounts?.[toolId] || 0) + 1;
              }

              const invitedBy = userData?.invitedBy;
              const referralActivated = userData?.referralActivated || false;

              if (isFirstSuccessfulUse && invitedBy && !referralActivated) {
                userUpdate.referralActivated = true;
                triggerReferralBonus = true;
                referrerUid = invitedBy;
              }

              transaction.update(userRef, userUpdate);
            }
          });

          // Perform referrer reward logic
          if (triggerReferralBonus && referrerUid) {
            try {
              const referrerRef = adminDb.collection("users").doc(referrerUid);
              await adminDb.runTransaction(async (referrerTx) => {
                const referrerSnap = await referrerTx.get(referrerRef);
                if (referrerSnap.exists) {
                  const refData = referrerSnap.data();
                  const currentReferralCount = (refData?.referralsCompletedCount || 0) + 1;
                  
                  const referrerUpdate: Record<string, any> = {
                    referralsCompletedCount: currentReferralCount,
                    updatedAt: now,
                  };

                  // If referral count reaches 3, 6, 9... (multiple of 3)
                  if (currentReferralCount % 3 === 0) {
                    const proDurationMs = 7 * 24 * 60 * 60 * 1000; // 7 days
                    let proUntilDate = new Date(now.getTime() + proDurationMs);
                    
                    const existingProUntil = refData?.proUntil ? refData.proUntil.toDate() : null;
                    if (existingProUntil && existingProUntil > now) {
                      proUntilDate = new Date(existingProUntil.getTime() + proDurationMs);
                    }

                    referrerUpdate.subscriptionTier = "pro";
                    referrerUpdate.subscriptionStatus = "active";
                    referrerUpdate.planType = "referral";
                    referrerUpdate.proUntil = proUntilDate;

                    // Update Redis tier cache for referrer
                    const remainderSeconds = Math.max(1, Math.floor((proUntilDate.getTime() - now.getTime()) / 1000));
                    redis.set(`user:tier:${referrerUid}`, "pro", { ex: remainderSeconds }).catch(console.error);
                  }

                  referrerTx.update(referrerRef, referrerUpdate);
                  console.log(`Successfully credited referral for referrer ${referrerUid}. Total completed: ${currentReferralCount}`);
                }
              });
            } catch (refError) {
              console.error(`Failed to reward referrer ${referrerUid}:`, refError);
            }
          }
        }
      } catch (err) {
        console.error("Failed to perform background Firestore usage update:", err);
      }
    };

    // Trigger non-blocking async update
    updateFirestore();

    return NextResponse.json({ success: true, count: newCount });
  } catch (error: any) {
    console.error("Usage increment API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
