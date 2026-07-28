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
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet, FieldDescription } from "@/components/ui/field";
import type { CartaMudancaFormState } from "./actions";

type Action = (state: CartaMudancaFormState, formData: FormData) => Promise<CartaMudancaFormState>;

type Membro = { id: number; nomeCompleto: string };
type Congregacao = { id: number; nome: string };

export function CartaMudancaForm({
  action,
  membros,
  congregacoes,
}: {
  action: Action;
  membros: Membro[];
  congregacoes: Congregacao[];
}) {
  const [state, formAction, isPending] = useActionState<CartaMudancaFormState, FormData>(
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
            <FieldLabel htmlFor="membroId">Membro</FieldLabel>
            <Select name="membroId" items={membroItems} required>
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
              <FieldLabel htmlFor="congregacaoDestinoId">Congregação destino (cadastrada)</FieldLabel>
              <Select name="congregacaoDestinoId" items={congregacaoItems}>
                <SelectTrigger id="congregacaoDestinoId" className="w-full">
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
            <Field>
              <FieldLabel htmlFor="igrejaDestinoTexto">Ou nome de outra igreja</FieldLabel>
              <Input id="igrejaDestinoTexto" name="igrejaDestinoTexto" />
              <FieldDescription>Use quando a igreja de destino não estiver cadastrada.</FieldDescription>
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="motivo">Motivo da mudança</FieldLabel>
            <Textarea id="motivo" name="motivo" rows={2} />
          </Field>

          <Field>
            <FieldLabel htmlFor="observacoes">Observações</FieldLabel>
            <Textarea id="observacoes" name="observacoes" rows={2} />
          </Field>

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar e gerar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
