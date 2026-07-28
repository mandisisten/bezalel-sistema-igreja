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
import type { ApresentacaoFormState } from "./actions";

type Action = (
  state: ApresentacaoFormState,
  formData: FormData,
) => Promise<ApresentacaoFormState>;

type Membro = { id: number; nomeCompleto: string };
type Congregacao = { id: number; nome: string };

export function ApresentacaoForm({
  action,
  membros,
  congregacoes,
  defaultValues,
}: {
  action: Action;
  membros: Membro[];
  congregacoes: Congregacao[];
  defaultValues?: {
    nomeCrianca: string;
    dataNascimento: string | null;
    nomePai: string | null;
    nomeMae: string | null;
    data: string;
    oficiante: string | null;
    congregacaoId: number | null;
    responsavelId: number | null;
    observacoes: string | null;
  };
}) {
  const [state, formAction, isPending] = useActionState<ApresentacaoFormState, FormData>(
    action,
    {},
  );
  const membroItems = Object.fromEntries(membros.map((m) => [String(m.id), m.nomeCompleto]));
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]));

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="nomeCrianca">Nome da criança</FieldLabel>
              <Input
                id="nomeCrianca"
                name="nomeCrianca"
                defaultValue={defaultValues?.nomeCrianca}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dataNascimento">Data de nascimento</FieldLabel>
              <Input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                defaultValue={defaultValues?.dataNascimento ?? ""}
              />
            </Field>
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="nomePai">Nome do pai</FieldLabel>
              <Input id="nomePai" name="nomePai" defaultValue={defaultValues?.nomePai ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="nomeMae">Nome da mãe</FieldLabel>
              <Input id="nomeMae" name="nomeMae" defaultValue={defaultValues?.nomeMae ?? ""} />
            </Field>
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="data">Data da apresentação</FieldLabel>
              <Input id="data" name="data" type="date" defaultValue={defaultValues?.data ?? ""} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="oficiante">Oficiante</FieldLabel>
              <Input id="oficiante" name="oficiante" defaultValue={defaultValues?.oficiante ?? ""} />
            </Field>
          </Field>

          <Field orientation="responsive">
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
            <Field>
              <FieldLabel htmlFor="responsavelId">Membro responsável</FieldLabel>
              <Select
                name="responsavelId"
                items={membroItems}
                defaultValue={
                  defaultValues?.responsavelId ? String(defaultValues.responsavelId) : undefined
                }
              >
                <SelectTrigger id="responsavelId" className="w-full">
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
          </Field>

          <Field>
            <FieldLabel htmlFor="observacoes">Observações</FieldLabel>
            <Textarea
              id="observacoes"
              name="observacoes"
              rows={2}
              defaultValue={defaultValues?.observacoes ?? ""}
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
