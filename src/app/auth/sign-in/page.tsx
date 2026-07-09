"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      await refresh();
      router.push(safeRedirect ?? `/profile/${data.user.username}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 rounded-2xl border border-border bg-white/75 p-6 shadow-[0_16px_40px_rgba(37,20,47,0.05)]">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-6 font-header text-2xl font-bold text-purple-dark">Sign in</h1>
          <p className="text-sm text-muted mt-1">Welcome back to Luomus</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-purple-dark">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20"
                placeholder="maya@luomus.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-purple-dark">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            <p className="text-center text-xs text-muted">Demo: maya@luomus.com / luomus123</p>
          </form>
        </div>
        <p className="text-sm text-muted mt-6 text-center">
          No account?{" "}
          <Link
            href={safeRedirect ? `/auth/sign-up?redirect=${encodeURIComponent(safeRedirect)}` : "/auth/sign-up"}
            className="text-purple hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
