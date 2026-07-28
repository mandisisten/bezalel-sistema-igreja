"use client";

import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/shared/delete-button";

export function MembroDeleteButton({
  action,
  nome,
}: {
  action: () => Promise<void>;
  nome: string;
}) {
  const router = useRouter();

  return (
    <DeleteButton
      action={action}
      title={`Excluir "${nome}"?`}
      description="Esta ação não pode ser desfeita. O membro só pode ser excluído se não houver registros vinculados (histórico, documentos, etc). Considere alterar o status para Inativo em vez de excluir."
      onSuccess={() => router.push("/membros")}
    />
  );
}
