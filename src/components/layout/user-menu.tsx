"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROLE_LABELS, type Role } from "@/lib/roles";

function initials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function UserMenu({
  nome,
  email,
  role,
}: {
  nome: string;
  email: string;
  role: Role;
}) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="flex items-center gap-2 px-2" />}
      >
        <Avatar className="size-8">
          <AvatarFallback>{initials(nome) || <User className="size-4" />}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">{nome}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium">{nome}</span>
            <span className="text-xs font-normal text-muted-foreground">{email}</span>
            <span className="text-xs font-normal text-muted-foreground">{ROLE_LABELS[role]}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          nativeButton
          render={<button type="button" className="flex w-full items-center gap-2" />}
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
