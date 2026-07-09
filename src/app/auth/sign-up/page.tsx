"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ displayName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirect = searchParams.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      await refresh();
      router.push(safeRedirect ?? `/profile/${data.user.username}`);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 rounded-2xl border border-border bg-white/75 p-6 shadow-[0_16px_40px_rgba(37,20,47,0.05)]">
          <Link href="/"><Logo /></Link>
          <h1 className="mt-6 font-header text-2xl font-bold text-purple-dark">Create account</h1>
          <p className="text-sm text-muted mt-1">Join Luomus — free for all crafts</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {(["displayName", "username", "email", "password"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1.5 block text-sm font-medium text-purple-dark capitalize">
                  {field === "displayName" ? "Display name" : field}
                </label>
                <input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  required
                  minLength={field === "password" ? 8 : undefined}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20"
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
        </div>
        <p className="text-sm text-muted mt-6 text-center">
          Have an account?{" "}
          <Link
            href={safeRedirect ? `/auth/sign-in?redirect=${encodeURIComponent(safeRedirect)}` : "/auth/sign-in"}
            className="text-purple hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
