"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldSeparator,
  FieldLegend,
} from "@/components/ui/field";
import { updateConfiguracao, type ConfiguracaoFormState } from "./actions";

export function ConfiguracaoForm({
  defaultValues,
}: {
  defaultValues: {
    nomeIgreja: string;
    cnpj: string | null;
    logoUrl: string | null;
    enderecoSede: string | null;
    telefoneSede: string | null;
    nomePresidente: string | null;
    cargoPresidente: string | null;
  };
}) {
  const [state, formAction, isPending] = useActionState<ConfiguracaoFormState, FormData>(
    updateConfiguracao,
    {},
  );
  const [preview, setPreview] = useState<string | null>(defaultValues.logoUrl);

  useEffect(() => {
    if (state.success) toast.success("Configurações salvas.");
  }, [state.success]);

  return (
    <form action={formAction}>
      <FieldSet>
        <FieldGroup>
          <FieldLegend>Logo</FieldLegend>
          <FieldGroup>
            <div className="flex items-center gap-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="Logo da igreja"
                  width={64}
                  height={64}
                  className="size-16 rounded-lg border object-contain p-1"
                />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-lg border bg-muted">
                  <Building2 className="size-6 text-muted-foreground" />
                </span>
              )}
              <Field className="max-w-xs">
                <FieldLabel htmlFor="logo">Logo da igreja</FieldLabel>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </Field>
            </div>
          </FieldGroup>

          <FieldSeparator />

          <FieldLegend>Dados da igreja</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nomeIgreja">Nome da igreja</FieldLabel>
              <Input id="nomeIgreja" name="nomeIgreja" defaultValue={defaultValues.nomeIgreja} required />
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
                <Input id="cnpj" name="cnpj" defaultValue={defaultValues.cnpj ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="telefoneSede">Telefone da sede</FieldLabel>
                <Input id="telefoneSede" name="telefoneSede" defaultValue={defaultValues.telefoneSede ?? ""} />
              </Field>
            </Field>

            <Field>
              <FieldLabel htmlFor="enderecoSede">Endereço da sede</FieldLabel>
              <Input id="enderecoSede" name="enderecoSede" defaultValue={defaultValues.enderecoSede ?? ""} />
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="nomePresidente">Nome do presidente/pastor</FieldLabel>
                <Input
                  id="nomePresidente"
                  name="nomePresidente"
                  defaultValue={defaultValues.nomePresidente ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cargoPresidente">Cargo (para assinatura)</FieldLabel>
                <Input
                  id="cargoPresidente"
                  name="cargoPresidente"
                  defaultValue={defaultValues.cargoPresidente ?? "Pastor Presidente"}
                />
              </Field>
            </Field>
          </FieldGroup>

          {state.error && <FieldError>{state.error}</FieldError>}

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
