"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
  { href: "/showroom", label: "Showroom" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/marketplace", label: "Shop" },
  { href: "/shop-finder", label: "Suppliers" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 glass font-header">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 lg:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden xl:flex items-center gap-1">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-2 text-[0.98rem] font-semibold leading-none tracking-[-0.015em] transition-colors rounded-full",
                pathname === href
                  ? "text-purple-dark bg-gradient-to-r from-purple-soft via-pink-soft to-yellow-soft"
                  : "text-muted hover:text-purple"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {loading ? (
            <div className="h-8 w-20 rounded-full bg-surface-muted animate-pulse" />
          ) : user ? (
            <>
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-2 px-2 text-[0.98rem] font-semibold leading-none tracking-[-0.015em] text-purple-dark hover:text-purple"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-xs font-bold text-white">
                  {user.avatar}
                </div>
                {user.displayName}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="!text-[0.98rem] !font-header !leading-none !tracking-[-0.015em]">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="pink" size="sm" className="!text-[0.98rem] !font-header !leading-none !tracking-[-0.015em]">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-yellow-soft"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden px-4 py-4 bg-white space-y-1">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-[1.03rem] font-semibold leading-none tracking-[-0.015em]",
                pathname === href
                  ? "bg-gradient-to-r from-purple-soft to-pink-soft text-purple-dark"
                  : "text-muted"
              )}
            >
              {label}
            </Link>
          ))}

          <div className="mt-3 border-t border-surface-muted pt-3 space-y-1">
            {loading ? (
              <div className="h-10 rounded-lg bg-surface-muted animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href={`/profile/${user.username}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[1.03rem] font-semibold leading-none tracking-[-0.015em] text-purple-dark hover:bg-yellow-soft"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-xs font-bold text-white">
                    {user.avatar}
                  </div>
                  {user.displayName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[1.03rem] font-semibold leading-none tracking-[-0.015em] text-muted hover:bg-yellow-soft"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[1.03rem] font-semibold leading-none tracking-[-0.015em] text-muted hover:bg-yellow-soft"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[1.03rem] font-semibold leading-none tracking-[-0.015em] text-purple-dark bg-gradient-to-r from-purple-soft to-pink-soft"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
