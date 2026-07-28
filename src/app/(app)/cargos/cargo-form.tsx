"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { CargoFormState } from "./actions";

type Action = (state: CargoFormState, formData: FormData) => Promise<CargoFormState>;

export function CargoForm({
  action,
  defaultValues,
}: {
  action: Action;
  defaultValues?: { nome: string; ordem: number; ativo: boolean };
}) {
  const [state, formAction, isPending] = useActionState<CargoFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction}>
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

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
