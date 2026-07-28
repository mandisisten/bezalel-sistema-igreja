import type { Role } from "@/lib/roles";
import {
  LayoutDashboard,
  Building2,
  BadgeCheck,
  Users,
  Droplets,
  Baby,
  GraduationCap,
  FileText,
  Mail,
  Send,
  CalendarDays,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Geral",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/agenda", label: "Agenda", icon: CalendarDays },
      { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { href: "/membros", label: "Membros", icon: Users },
      { href: "/batismos", label: "Batismos", icon: Droplets },
      { href: "/apresentacoes", label: "Apresentações", icon: Baby },
      { href: "/cursos", label: "Cursos", icon: GraduationCap },
    ],
  },
  {
    label: "Documentos",
    items: [
      { href: "/cartas/recomendacao", label: "Cartas de Recomendação", icon: Mail },
      { href: "/cartas/mudanca", label: "Cartas de Mudança", icon: Send },
      { href: "/documentos", label: "Documentos emitidos", icon: FileText },
    ],
  },
  {
    label: "Administração",
    items: [
      { href: "/congregacoes", label: "Congregações", icon: Building2, roles: ["ADMIN"] },
      { href: "/cargos", label: "Cargos", icon: BadgeCheck, roles: ["ADMIN"] },
      { href: "/configuracoes", label: "Configurações", icon: Settings, roles: ["ADMIN"] },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
