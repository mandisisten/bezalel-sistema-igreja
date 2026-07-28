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
import type { CartaRecomendacaoFormState } from "./actions";

type Action = (
  state: CartaRecomendacaoFormState,
  formData: FormData,
) => Promise<CartaRecomendacaoFormState>;

type Membro = { id: number; nomeCompleto: string };

const TIPO_ITEMS = { OBREIRO: "Obreiro", MEMBRO: "Membro" };

export function CartaRecomendacaoForm({
  action,
  membros,
}: {
  action: Action;
  membros: Membro[];
}) {
  const [state, formAction, isPending] = useActionState<CartaRecomendacaoFormState, FormData>(
    action,
    {},
  );
  const membroItems = Object.fromEntries(membros.map((m) => [String(m.id), m.nomeCompleto]));

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="membroId">Membro/obreiro</FieldLabel>
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
            <Field>
              <FieldLabel htmlFor="tipo">Tipo</FieldLabel>
              <Select name="tipo" items={TIPO_ITEMS} defaultValue="MEMBRO" required>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OBREIRO">Obreiro</SelectItem>
                  <SelectItem value="MEMBRO">Membro</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="destinatario">Destinatário</FieldLabel>
            <Input
              id="destinatario"
              name="destinatario"
              placeholder="Ex: À Igreja Batista Central"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="finalidade">Finalidade</FieldLabel>
            <Textarea id="finalidade" name="finalidade" rows={2} />
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
