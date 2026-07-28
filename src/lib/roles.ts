export const ROLES = ["ADMIN", "SECRETARIA", "LIDERANCA", "LEITURA"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  SECRETARIA: "Secretaria",
  LIDERANCA: "Liderança",
  LEITURA: "Leitura",
};
