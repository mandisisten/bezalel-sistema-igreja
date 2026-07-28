"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import type { BatismoFormState } from "./actions";

type Action = (state: BatismoFormState, formData: FormData) => Promise<BatismoFormState>;

type Membro = { id: number; nomeCompleto: string };
type Congregacao = { id: number; nome: string };

export function BatismoForm({
  action,
  membros,
  congregacoes,
  defaultValues,
}: {
  action: Action;
  membros: Membro[];
  congregacoes: Congregacao[];
  defaultValues?: {
    membroId: number;
    data: string;
    local: string | null;
    oficiante: string | null;
    testemunhas: string | null;
    congregacaoId: number | null;
  };
}) {
  const [state, formAction, isPending] = useActionState<BatismoFormState, FormData>(
    action,
    {},
  );
  const membroItems = Object.fromEntries(membros.map((m) => [String(m.id), m.nomeCompleto]));
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]));

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="membroId">Membro batizado</FieldLabel>
            <Select
              name="membroId"
              items={membroItems}
              defaultValue={defaultValues?.membroId ? String(defaultValues.membroId) : undefined}
              required
            >
              <SelectTrigger id="membroId" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {membros.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.nomeCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="data">Data do batismo</FieldLabel>
              <Input id="data" name="data" type="date" defaultValue={defaultValues?.data ?? ""} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="local">Local</FieldLabel>
              <Input id="local" name="local" defaultValue={defaultValues?.local ?? ""} />
            </Field>
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="oficiante">Oficiante</FieldLabel>
              <Input id="oficiante" name="oficiante" defaultValue={defaultValues?.oficiante ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="congregacaoId">Congregação</FieldLabel>
              <Select
                name="congregacaoId"
                items={congregacaoItems}
                defaultValue={
                  defaultValues?.congregacaoId ? String(defaultValues.congregacaoId) : undefined
                }
              >
                <SelectTrigger id="congregacaoId" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {congregacoes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="testemunhas">Testemunhas</FieldLabel>
            <Textarea
              id="testemunhas"
              name="testemunhas"
              rows={2}
              defaultValue={defaultValues?.testemunhas ?? ""}
            />
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
