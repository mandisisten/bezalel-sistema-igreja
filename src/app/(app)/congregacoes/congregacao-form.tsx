"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
} from "@/components/ui/field";

export function CongregacaoForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<unknown>;
  defaultValues?: {
    nome: string;
    matriz: boolean;
    endereco: string | null;
    cidade: string | null;
    uf: string | null;
    telefone: string | null;
    pastorResponsavel: string | null;
    dataFundacao: string | null;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await action(formData);
      toast.success("Congregação salva.");
      router.push("/congregacoes");
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
            <FieldLabel htmlFor="nome">Nome da congregação</FieldLabel>
            <Input id="nome" name="nome" defaultValue={defaultValues?.nome} required />
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="matriz" name="matriz" defaultChecked={defaultValues?.matriz} />
            <FieldLabel htmlFor="matriz">Esta é a congregação sede (matriz)</FieldLabel>
          </Field>

          <Field>
            <FieldLabel htmlFor="pastorResponsavel">Pastor responsável</FieldLabel>
            <Input
              id="pastorResponsavel"
              name="pastorResponsavel"
              defaultValue={defaultValues?.pastorResponsavel ?? ""}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
            <Input id="telefone" name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
          </Field>

          <Field>
            <FieldLabel htmlFor="endereco">Endereço</FieldLabel>
            <Input id="endereco" name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
          </Field>

          <Field orientation="responsive">
            <Field>
              <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
              <Input id="cidade" name="cidade" defaultValue={defaultValues?.cidade ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="uf">UF</FieldLabel>
              <Input id="uf" name="uf" maxLength={2} defaultValue={defaultValues?.uf ?? ""} />
            </Field>
          </Field>

          <Field>
            <FieldLabel htmlFor="dataFundacao">Data de fundação</FieldLabel>
            <Input
              id="dataFundacao"
              name="dataFundacao"
              type="date"
              defaultValue={defaultValues?.dataFundacao ?? ""}
            />
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
