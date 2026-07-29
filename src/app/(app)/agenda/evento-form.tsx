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
import { TIPO_EVENTO_OPTIONS, RECORRENCIA_OPTIONS } from "@/lib/evento-options";
import { toSelectItems } from "@/lib/member-options";

type Membro = { id: string; nomeCompleto: string };
type Congregacao = { id: string; nome: string };

const TIPO_ITEMS = toSelectItems(TIPO_EVENTO_OPTIONS);
const RECORRENCIA_ITEMS = toSelectItems(RECORRENCIA_OPTIONS);

export function EventoForm({
  action,
  membros,
  congregacoes,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
  congregacoes: Congregacao[];
  defaultValues?: {
    titulo: string;
    descricao: string | null;
    inicio: string;
    fim: string;
    local: string | null;
    tipo: string | null;
    congregacaoId: string | null;
    responsavelId: string | null;
    recorrencia: string | null;
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
      toast.success("Evento salvo.");
      router.push("/agenda");
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
            <FieldLabel htmlFor="titulo">Título</FieldLabel>
            <Input id="titulo" name="titulo" defaultValue={defaultValues?.titulo} required />
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="inicio">Início</FieldLabel>
              <Input
                id="inicio"
                name="inicio"
                type="datetime-local"
                defaultValue={defaultValues?.inicio ?? ""}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="fim">Fim</FieldLabel>
              <Input
                id="fim"
                name="fim"
                type="datetime-local"
                defaultValue={defaultValues?.fim ?? ""}
                required
              />
            </Field>
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="local">Local</FieldLabel>
              <Input id="local" name="local" defaultValue={defaultValues?.local ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="tipo">Tipo</FieldLabel>
              <Select name="tipo" items={TIPO_ITEMS} defaultValue={defaultValues?.tipo ?? undefined}>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_EVENTO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="recorrencia">Recorrência</FieldLabel>
              <Select
                name="recorrencia"
                items={RECORRENCIA_ITEMS}
                defaultValue={defaultValues?.recorrencia ?? "NENHUMA"}
              >
                <SelectTrigger id="recorrencia" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {RECORRENCIA_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectValue placeholder="Todas" />
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
              <FieldLabel htmlFor="responsavelId">Responsável</FieldLabel>
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
            <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              rows={3}
              defaultValue={defaultValues?.descricao ?? ""}
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
