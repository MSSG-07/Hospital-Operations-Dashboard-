"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Activity,
  Lock,
  Mail,
  Heart,
  Shield,
  MonitorDot,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginApi(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0a0f1c]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4 animate-pulse-glow">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Hospital Operations
          </h1>
          <p className="text-muted-foreground text-sm">
            Intelligence Dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-effect border-border/50 gradient-border">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-white">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the command center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Access Dashboard
                  </span>
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-5 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Demo Credentials
              </p>
              <div className="flex gap-2 text-xs">
                <div className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-center">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="text-blue-400 font-mono">admin@hospital.com</span>
                </div>
                <div className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-center">
                  <span className="text-muted-foreground">Pass:</span>{" "}
                  <span className="text-blue-400 font-mono">admin123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: MonitorDot, label: "Real-time Monitoring" },
            { icon: Heart, label: "Patient Analytics" },
            { icon: Shield, label: "Alert System" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="text-center p-3 rounded-lg bg-card/50 border border-border/30"
            >
              <feature.icon className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <p className="text-[10px] text-muted-foreground leading-tight">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
