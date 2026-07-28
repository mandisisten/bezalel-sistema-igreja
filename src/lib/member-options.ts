export const SEXO_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
];

export const ESTADO_CIVIL_OPTIONS = [
  { value: "SOLTEIRO", label: "Solteiro(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUVO", label: "Viúvo(a)" },
  { value: "UNIAO_ESTAVEL", label: "União estável" },
];

export const FORMA_ADMISSAO_OPTIONS = [
  { value: "BATISMO", label: "Batismo" },
  { value: "TRANSFERENCIA", label: "Transferência" },
  { value: "RECONCILIACAO", label: "Reconciliação" },
  { value: "ACLAMACAO", label: "Aclamação" },
];

export const STATUS_MEMBRO_OPTIONS = [
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
  { value: "TRANSFERIDO", label: "Transferido" },
  { value: "FALECIDO", label: "Falecido" },
];

export const ESCOLARIDADE_OPTIONS = [
  { value: "FUNDAMENTAL_INCOMPLETO", label: "Fundamental incompleto" },
  { value: "FUNDAMENTAL_COMPLETO", label: "Fundamental completo" },
  { value: "MEDIO_INCOMPLETO", label: "Médio incompleto" },
  { value: "MEDIO_COMPLETO", label: "Médio completo" },
  { value: "SUPERIOR_INCOMPLETO", label: "Superior incompleto" },
  { value: "SUPERIOR_COMPLETO", label: "Superior completo" },
  { value: "POS_GRADUACAO", label: "Pós-graduação" },
];

export function toSelectItems(options: { value: string; label: string }[]) {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

export function optionLabel(
  options: { value: string; label: string }[],
  value: string | null | undefined,
) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}
