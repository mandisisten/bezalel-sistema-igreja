"use client";

import { useAuth } from "@/lib/firebase-auth";
import { useConfiguracao } from "@/lib/firestore-hooks";
import { AuthGuard } from "@/components/layout/auth-guard";
import { DesktopSidebar, MobileNav } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/components/layout/user-menu";

function AppShell({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const { configuracao } = useConfiguracao();

  if (!profile) return null;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DesktopSidebar
        role={profile.role}
        logoUrl={configuracao.logoUrl}
        nomeIgreja={configuracao.nomeIgreja}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
          <MobileNav
            role={profile.role}
            logoUrl={configuracao.logoUrl}
            nomeIgreja={configuracao.nomeIgreja}
          />
          <div className="flex-1" />
          <UserMenu nome={profile.nome} email={profile.email} role={profile.role} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
