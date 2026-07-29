"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";

export function CursoForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  defaultValues?: {
    nome: string;
    cargaHoraria: number | null;
    descricao: string | null;
    ativo: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Curso salvo.");
      router.push("/cursos");
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
          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="nome">Nome do curso</FieldLabel>
              <Input id="nome" name="nome" defaultValue={defaultValues?.nome} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="cargaHoraria">Carga horária (h)</FieldLabel>
              <Input
                id="cargaHoraria"
                name="cargaHoraria"
                type="number"
                min={0}
                defaultValue={defaultValues?.cargaHoraria ?? ""}
              />
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              rows={3}
              defaultValue={defaultValues?.descricao ?? ""}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="ativo" name="ativo" defaultChecked={defaultValues?.ativo ?? true} />
            <FieldLabel htmlFor="ativo">Curso ativo</FieldLabel>
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
