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
import { Field, FieldGroup, FieldLabel, FieldError, FieldSet, FieldDescription } from "@/components/ui/field";

type Membro = { id: string; nomeCompleto: string };
type Congregacao = { id: string; nome: string };

export function CartaMudancaForm({
  action,
  membros,
  congregacoes,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
  congregacoes: Congregacao[];
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
      toast.success("Carta salva.");
      router.push("/cartas/mudanca");
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
            <FieldLabel htmlFor="membroId">Membro</FieldLabel>
            <Select name="membroId" items={membroItems} required>
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
              <FieldLabel htmlFor="congregacaoDestinoId">Congregação destino (cadastrada)</FieldLabel>
              <Select name="congregacaoDestinoId" items={congregacaoItems}>
                <SelectTrigger id="congregacaoDestinoId" className="w-full">
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

          {error && <FieldError>{error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
