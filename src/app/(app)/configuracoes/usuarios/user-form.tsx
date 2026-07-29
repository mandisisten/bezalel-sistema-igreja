"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { enviarRedefinicaoSenha } from "./actions";

type Congregacao = { id: string; nome: string };

const ROLE_OPTIONS = ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));
const ROLE_ITEMS = toSelectItems(ROLE_OPTIONS);

export function UserForm({
  action,
  congregacoes,
  mode,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  congregacoes: Congregacao[];
  mode: "create" | "edit";
  defaultValues?: {
    nome: string;
    email?: string;
    role: string;
    congregacaoId: string | null;
    ativo?: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [enviandoReset, setEnviandoReset] = useState(false);
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [c.id, c.nome]));

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Usuário salvo.");
      router.push("/configuracoes/usuarios");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleEnviarReset() {
    if (!defaultValues?.email) return;
    setEnviandoReset(true);
    try {
      await enviarRedefinicaoSenha(defaultValues.email);
      toast.success("E-mail de redefinição de senha enviado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar e-mail.");
    } finally {
      setEnviandoReset(false);
    }
  }

  return (
    <form action={handleSubmit}>
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

          {mode === "create" ? (
            <Field>
              <FieldLabel htmlFor="senha">Senha</FieldLabel>
              <Input id="senha" name="senha" type="password" required minLength={6} />
            </Field>
          ) : (
            <Field>
              <FieldLabel>Senha</FieldLabel>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={enviandoReset}
                  onClick={handleEnviarReset}
                >
                  {enviandoReset ? "Enviando..." : "Enviar e-mail de redefinição de senha"}
                </Button>
              </div>
              <FieldDescription>
                Por segurança, a senha só pode ser alterada pelo próprio usuário via e-mail.
              </FieldDescription>
            </Field>
          )}

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
                defaultValue={defaultValues?.congregacaoId ?? undefined}
              >
                <SelectTrigger id="congregacaoId" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {congregacoes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
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

          {error && <FieldError>{error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
