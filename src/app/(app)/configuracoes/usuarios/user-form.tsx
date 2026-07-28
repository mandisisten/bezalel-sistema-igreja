"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet, FieldDescription } from "@/components/ui/field";
import { ROLES, ROLE_LABELS } from "@/lib/roles";
import { toSelectItems } from "@/lib/member-options";
import type { UserFormState } from "./actions";

type Action = (state: UserFormState, formData: FormData) => Promise<UserFormState>;

type Congregacao = { id: number; nome: string };

const ROLE_OPTIONS = ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));
const ROLE_ITEMS = toSelectItems(ROLE_OPTIONS);

export function UserForm({
  action,
  congregacoes,
  mode,
  defaultValues,
}: {
  action: Action;
  congregacoes: Congregacao[];
  mode: "create" | "edit";
  defaultValues?: {
    nome: string;
    email?: string;
    role: string;
    congregacaoId: number | null;
    ativo?: boolean;
  };
}) {
  const [state, formAction, isPending] = useActionState<UserFormState, FormData>(action, {});
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]));

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input id="nome" name="nome" defaultValue={defaultValues?.nome} required />
          </Field>

          {mode === "create" && (
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input id="email" name="email" type="email" required />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="senha">
              {mode === "create" ? "Senha" : "Nova senha (opcional)"}
            </FieldLabel>
            <Input id="senha" name="senha" type="password" required={mode === "create"} />
            {mode === "edit" && (
              <FieldDescription>Deixe em branco para manter a senha atual.</FieldDescription>
            )}
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="role">Papel</FieldLabel>
              <Select name="role" items={ROLE_ITEMS} defaultValue={defaultValues?.role ?? "SECRETARIA"} required>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {mode === "edit" && (
            <Field orientation="horizontal">
              <Checkbox id="ativo" name="ativo" defaultChecked={defaultValues?.ativo ?? true} />
              <FieldLabel htmlFor="ativo">Usuário ativo</FieldLabel>
            </Field>
          )}

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
