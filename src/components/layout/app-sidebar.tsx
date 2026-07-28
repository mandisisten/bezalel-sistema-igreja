"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Church } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/nav-items";
import type { Role } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4">
      {NAV_SECTIONS.map((section) => {
        const items = section.items.filter((item) => !item.roles || item.roles.includes(role));
        if (items.length === 0) return null;

        return (
          <div key={section.label} className="flex flex-col gap-1">
            <span className="px-3 text-[11px] font-semibold tracking-wide text-sidebar-foreground/45 uppercase">
              {section.label}
            </span>
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

function Brand({ logoUrl, nomeIgreja }: { logoUrl: string | null; nomeIgreja: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-5">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={nomeIgreja}
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-md object-contain"
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Church className="size-4.5" />
        </span>
      )}
      <span className="truncate font-semibold text-sidebar-foreground">{nomeIgreja}</span>
    </div>
  );
}

export function DesktopSidebar({
  role,
  logoUrl,
  nomeIgreja,
}: {
  role: Role;
  logoUrl: string | null;
  nomeIgreja: string;
}) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <Brand logoUrl={logoUrl} nomeIgreja={nomeIgreja} />
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavLinks role={role} />
      </div>
    </aside>
  );
}

export function MobileNav({
  role,
  logoUrl,
  nomeIgreja,
}: {
  role: Role;
  logoUrl: string | null;
  nomeIgreja: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <Brand logoUrl={logoUrl} nomeIgreja={nomeIgreja} />
        <div className="px-3 pb-4">
          <NavLinks role={role} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
