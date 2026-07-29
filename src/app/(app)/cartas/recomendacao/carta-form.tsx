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

const TIPO_ITEMS = { OBREIRO: "Obreiro", MEMBRO: "Membro" };

export function CartaRecomendacaoForm({
  action,
  membros,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const membroItems = Object.fromEntries(membros.map((m) => [m.id, m.nomeCompleto]));

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Carta salva.");
      router.push("/cartas/recomendacao");
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
              <FieldLabel htmlFor="membroId">Membro/obreiro</FieldLabel>
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
            <Input id="destinatario" name="destinatario" placeholder="Ex: À Igreja Batista Central" />
          </Field>

          <Field>
            <FieldLabel htmlFor="finalidade">Finalidade</FieldLabel>
            <Textarea id="finalidade" name="finalidade" rows={2} />
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
