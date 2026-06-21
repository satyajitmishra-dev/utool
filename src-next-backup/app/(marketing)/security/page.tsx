import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Lock, Key, ServerOff } from "lucide-react";

export const metadata = constructMetadata({
  title: "Security Architecture — Zero Cloud Exposure | utool",
  description: "Learn about utool's local-first security architecture. Explore browser sandboxing, HTTPS delivery, Firebase JWT integration, and zero file upload designs.",
});

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security Center
          </Badge>
          <h1 className="text-display-sm md:text-display-md font-extrabold tracking-tight text-foreground leading-tight">
            Security by architectural design.
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Unlike traditional platforms that secure documents by trying to protect their servers, utool secures your documents by eliminating the servers entirely.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 space-y-3">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <ServerOff className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">No Server Storage</h4>
            <p className="text-4xs text-muted-foreground leading-relaxed">
              We never upload, stream, or log your file inputs. Processing happens locally in your browser memory via WebAssembly.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Browser Sandboxing</h4>
            <p className="text-4xs text-muted-foreground leading-relaxed">
              All compilers operate inside standard browser security sandboxes, protecting you against script injections and document corruption.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Key className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Firebase Auth</h4>
            <p className="text-4xs text-muted-foreground leading-relaxed">
              User logins and credentials use Firebase SDK security and encrypted session tokens for rate limits.
            </p>
          </GlassCard>
        </div>

        {/* Security Details */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed max-w-3xl text-justify">
          <h2 className="text-base font-bold text-foreground">Local Browser Processing Details</h2>
          <p>
            When you load a document into our workspace, the file is parsed inside the client browser instance using libraries compiled in WebAssembly and vanilla JavaScript. We utilize <code>pdf-lib</code> and <code>qrcode</code> running in memory, meaning that standard server-side vulnerabilities like remote execution vectors, cache leakages, and server database hacks are completely bypassed.
          </p>
          <p>
            Your documents never traverse the network. Even under a complete server compromise, your files remain safe since there are no document processing pipelines running on our hosts, nor do we store files in any database.
          </p>
          <h2 className="text-base font-bold text-foreground">Safe Link Shortener Redirections</h2>
          <p>
            Short links are mapped to their target destinations using a high-performance Upstash Redis caching database. When a visitor hits a short code link, the redirection is processed using edge functions that forward the visitor to the target address in milliseconds, ensuring no intermediate proxy redirects or advertisement injections occur.
          </p>
        </div>
      </div>
    </div>
  );
}
