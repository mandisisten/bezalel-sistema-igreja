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

export function ApresentacaoForm({
  action,
  membros,
  congregacoes,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
  congregacoes: Congregacao[];
  defaultValues?: {
    nomeCrianca: string;
    dataNascimento: string | null;
    nomePai: string | null;
    nomeMae: string | null;
    data: string;
    oficiante: string | null;
    congregacaoId: string | null;
    responsavelId: string | null;
    observacoes: string | null;
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
      toast.success("Apresentação salva.");
      router.push("/apresentacoes");
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
              <FieldLabel htmlFor="nomeCrianca">Nome da criança</FieldLabel>
              <Input id="nomeCrianca" name="nomeCrianca" defaultValue={defaultValues?.nomeCrianca} required />
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
            <Field>
              <FieldLabel htmlFor="responsavelId">Membro responsável</FieldLabel>
              <Select
                name="responsavelId"
                items={membroItems}
                defaultValue={defaultValues?.responsavelId ?? undefined}
              >
                <SelectTrigger id="responsavelId" className="w-full">
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

          {error && <FieldError>{error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
