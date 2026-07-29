"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

type Membro = { id: string; nomeCompleto: string };
type Congregacao = { id: string; nome: string };

export function BatismoForm({
  action,
  membros,
  congregacoes,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
  congregacoes: Congregacao[];
  defaultValues?: {
    membroId: string;
    data: string;
    local: string | null;
    oficiante: string | null;
    testemunhas: string | null;
    congregacaoId: string | null;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const membroItems = Object.fromEntries(membros.map((m) => [m.id, m.nomeCompleto]));
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [c.id, c.nome]));

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Batismo salvo.");
      router.push("/batismos");
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
            <FieldLabel htmlFor="membroId">Membro batizado</FieldLabel>
            <Select name="membroId" items={membroItems} defaultValue={defaultValues?.membroId} required>
              <SelectTrigger id="membroId" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {membros.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
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

          <Field>
            <FieldLabel htmlFor="testemunhas">Testemunhas</FieldLabel>
            <Textarea
              id="testemunhas"
              name="testemunhas"
              rows={2}
              defaultValue={defaultValues?.testemunhas ?? ""}
            />
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
