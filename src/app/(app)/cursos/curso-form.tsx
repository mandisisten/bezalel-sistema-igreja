"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { CursoFormState } from "./actions";

type Action = (state: CursoFormState, formData: FormData) => Promise<CursoFormState>;

export function CursoForm({
  action,
  defaultValues,
}: {
  action: Action;
  defaultValues?: {
    nome: string;
    cargaHoraria: number | null;
    descricao: string | null;
    ativo: boolean;
  };
}) {
  const [state, formAction, isPending] = useActionState<CursoFormState, FormData>(action, {});

  return (
    <form action={formAction}>
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

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
