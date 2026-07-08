"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignInPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.push(`/profile/${data.user.username}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link href="/"><Logo /></Link>
          <h1 className="font-header text-2xl font-bold text-purple-dark mt-6">Sign in</h1>
          <p className="text-sm text-muted mt-1">Welcome back to craftopia</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-purple-dark mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20"
              placeholder="maya@luomus.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-dark mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          <p className="text-xs text-muted text-center">Demo: maya@luomus.com / luomus123</p>
        </form>
        <p className="text-sm text-muted mt-6 text-center">
          No account?{" "}
          <Link href="/auth/sign-up" className="text-purple hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
