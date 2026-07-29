"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";

export function CargoForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  defaultValues?: { nome: string; ordem: number; ativo: boolean };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Cargo salvo.");
      router.push("/cargos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nome">Nome do cargo</FieldLabel>
            <Input id="nome" name="nome" defaultValue={defaultValues?.nome} required />
          </Field>

          <Field>
            <FieldLabel htmlFor="ordem">Ordem de exibição</FieldLabel>
            <Input
              id="ordem"
              name="ordem"
              type="number"
              min={0}
              defaultValue={defaultValues?.ordem ?? 0}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="ativo" name="ativo" defaultChecked={defaultValues?.ativo ?? true} />
            <FieldLabel htmlFor="ativo">Cargo ativo</FieldLabel>
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
