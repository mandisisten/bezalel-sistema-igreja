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
type Curso = { id: string; nome: string };

export function ConclusaoForm({
  action,
  membros,
  cursos,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  membros: Membro[];
  cursos: Curso[];
  defaultValues?: {
    cursoId: string;
    membroId: string;
    dataConclusao: string;
    instrutor: string | null;
    nota: string | null;
    observacoes: string | null;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const membroItems = Object.fromEntries(membros.map((m) => [m.id, m.nomeCompleto]));
  const cursoItems = Object.fromEntries(cursos.map((c) => [c.id, c.nome]));

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Conclusão salva.");
      router.push("/cursos/conclusoes");
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
              <FieldLabel htmlFor="cursoId">Curso</FieldLabel>
              <Select
                name="cursoId"
                items={cursoItems}
                defaultValue={defaultValues?.cursoId}
                required
              >
                <SelectTrigger id="cursoId" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="membroId">Membro</FieldLabel>
              <Select
                name="membroId"
                items={membroItems}
                defaultValue={defaultValues?.membroId}
                required
              >
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
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="dataConclusao">Data de conclusão</FieldLabel>
              <Input
                id="dataConclusao"
                name="dataConclusao"
                type="date"
                defaultValue={defaultValues?.dataConclusao ?? ""}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="instrutor">Instrutor</FieldLabel>
              <Input id="instrutor" name="instrutor" defaultValue={defaultValues?.instrutor ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="nota">Nota/Conceito</FieldLabel>
              <Input id="nota" name="nota" defaultValue={defaultValues?.nota ?? ""} />
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
