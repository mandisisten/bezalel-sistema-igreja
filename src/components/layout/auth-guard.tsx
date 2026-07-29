"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase-auth";
import type { Role } from "@/lib/roles";

export function AuthGuard({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !profile) {
      router.replace("/login");
      return;
    }
    if (roles && !roles.includes(profile.role)) {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, roles, router]);

  if (loading || !user || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (roles && !roles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
}
