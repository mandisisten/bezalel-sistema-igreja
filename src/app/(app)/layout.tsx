import { requireUser } from "@/lib/auth";
import { getConfiguracao } from "@/lib/documento";
import { DesktopSidebar, MobileNav } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/components/layout/user-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, configuracao] = await Promise.all([requireUser(), getConfiguracao()]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <DesktopSidebar
        role={session.role}
        logoUrl={configuracao.logoUrl}
        nomeIgreja={configuracao.nomeIgreja}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
          <MobileNav
            role={session.role}
            logoUrl={configuracao.logoUrl}
            nomeIgreja={configuracao.nomeIgreja}
          />
          <div className="flex-1" />
          <UserMenu nome={session.nome} email={session.email} role={session.role} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
