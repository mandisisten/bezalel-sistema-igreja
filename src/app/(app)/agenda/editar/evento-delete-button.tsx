"use client";

import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/shared/delete-button";

export function EventoDeleteButton({
  action,
  titulo,
}: {
  action: () => Promise<void>;
  titulo: string;
}) {
  const router = useRouter();

  return (
    <DeleteButton
      action={action}
      title={`Excluir "${titulo}"?`}
      description="Esta ação não pode ser desfeita."
      onSuccess={() => router.push("/agenda")}
    />
  );
}
