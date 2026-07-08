"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

type TeaserGateProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function authHref(base: string, returnUrl: string) {
  return `${base}?redirect=${encodeURIComponent(returnUrl)}`;
}

export function TeaserGate({ title, description, children }: TeaserGateProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [returnUrl, setReturnUrl] = useState(pathname);

  useEffect(() => {
    setReturnUrl(window.location.pathname + window.location.search);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen craft-grid flex items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const signInHref = authHref("/auth/sign-in", returnUrl);
  const signUpHref = authHref("/auth/sign-up", returnUrl);

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none select-none max-h-[75vh] overflow-hidden blur-[6px] opacity-45 saturate-50"
        aria-hidden="true"
      >
        {children}
      </div>

      <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-4 pt-12 pb-10 bg-gradient-to-b from-background via-background/98 to-transparent">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-white/95 p-8 text-center shadow-[0_24px_60px_rgba(37,20,47,0.12)] backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-pink/20">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-purple-dark">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted font-body">{description}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={signInHref}>
              <Button variant="secondary">Sign in</Button>
            </Link>
            <Link href={signUpHref}>
              <Button variant="outline">Create account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
