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
import type { ConclusaoFormState } from "./actions";

type Action = (state: ConclusaoFormState, formData: FormData) => Promise<ConclusaoFormState>;

type Membro = { id: number; nomeCompleto: string };
type Curso = { id: number; nome: string };

export function ConclusaoForm({
  action,
  membros,
  cursos,
  defaultValues,
}: {
  action: Action;
  membros: Membro[];
  cursos: Curso[];
  defaultValues?: {
    cursoId: number;
    membroId: number;
    dataConclusao: string;
    instrutor: string | null;
    nota: string | null;
    observacoes: string | null;
  };
}) {
  const [state, formAction, isPending] = useActionState<ConclusaoFormState, FormData>(
    action,
    {},
  );
  const membroItems = Object.fromEntries(membros.map((m) => [String(m.id), m.nomeCompleto]));
  const cursoItems = Object.fromEntries(cursos.map((c) => [String(c.id), c.nome]));

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="cursoId">Curso</FieldLabel>
              <Select
                name="cursoId"
                items={cursoItems}
                defaultValue={defaultValues?.cursoId ? String(defaultValues.cursoId) : undefined}
                required
              >
                <SelectTrigger id="cursoId" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
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
                defaultValue={defaultValues?.membroId ? String(defaultValues.membroId) : undefined}
                required
              >
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

          {state.error && <FieldError>{state.error}</FieldError>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
