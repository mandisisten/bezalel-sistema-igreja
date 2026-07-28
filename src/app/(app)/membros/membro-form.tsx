"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import {
  SEXO_OPTIONS,
  ESTADO_CIVIL_OPTIONS,
  FORMA_ADMISSAO_OPTIONS,
  STATUS_MEMBRO_OPTIONS,
  ESCOLARIDADE_OPTIONS,
  toSelectItems,
} from "@/lib/member-options";

const SEXO_ITEMS = toSelectItems(SEXO_OPTIONS);
const ESTADO_CIVIL_ITEMS = toSelectItems(ESTADO_CIVIL_OPTIONS);
const FORMA_ADMISSAO_ITEMS = toSelectItems(FORMA_ADMISSAO_OPTIONS);
const STATUS_MEMBRO_ITEMS = toSelectItems(STATUS_MEMBRO_OPTIONS);
const ESCOLARIDADE_ITEMS = toSelectItems(ESCOLARIDADE_OPTIONS);
import type { MembroFormState } from "./actions";

type Action = (state: MembroFormState, formData: FormData) => Promise<MembroFormState>;

type Congregacao = { id: number; nome: string };
type Cargo = { id: number; nome: string };

type DefaultValues = {
  nomeCompleto: string;
  apelido: string | null;
  fotoUrl: string | null;
  dataNascimento: string | null;
  sexo: string | null;
  estadoCivil: string | null;
  naturalidade: string | null;
  nacionalidade: string | null;
  rg: string | null;
  cpf: string | null;
  cep: string | null;
  endereco: string | null;
  numeroCasa: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  profissao: string | null;
  escolaridade: string | null;
  nomeConjuge: string | null;
  nomePai: string | null;
  nomeMae: string | null;
  dataConversao: string | null;
  dataAdmissao: string | null;
  formaAdmissao: string | null;
  congregacaoId: number;
  cargoId: number | null;
  status: string;
  dataSaida: string | null;
  motivoSaida: string | null;
  observacoes: string | null;
};

export function MembroForm({
  action,
  congregacoes,
  cargos,
  defaultValues,
}: {
  action: Action;
  congregacoes: Congregacao[];
  cargos: Cargo[];
  defaultValues?: DefaultValues;
}) {
  const [state, formAction, isPending] = useActionState<MembroFormState, FormData>(
    action,
    {},
  );
  const [preview, setPreview] = useState<string | null>(defaultValues?.fotoUrl ?? null);
  const congregacaoItems = Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]));
  const cargoItems = Object.fromEntries(cargos.map((c) => [String(c.id), c.nome]));

  return (
    <form action={formAction}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Foto</FieldLegend>
          <FieldGroup>
            <div className="flex items-center gap-4">
              {preview && (
                <Image
                  src={preview}
                  alt="Pré-visualização"
                  width={80}
                  height={80}
                  className="size-20 rounded-full border object-cover"
                />
              )}
              <Field className="max-w-xs">
                <FieldLabel htmlFor="foto">Foto do membro</FieldLabel>
                <Input
                  id="foto"
                  name="foto"
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
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Dados pessoais</FieldLegend>
          <FieldGroup>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="nomeCompleto">Nome completo</FieldLabel>
                <Input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  defaultValue={defaultValues?.nomeCompleto}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="apelido">Apelido</FieldLabel>
                <Input id="apelido" name="apelido" defaultValue={defaultValues?.apelido ?? ""} />
              </Field>
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="dataNascimento">Data de nascimento</FieldLabel>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  defaultValue={defaultValues?.dataNascimento ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sexo">Sexo</FieldLabel>
                <Select
                  name="sexo"
                  items={SEXO_ITEMS}
                  defaultValue={defaultValues?.sexo ?? undefined}
                >
                  <SelectTrigger id="sexo" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEXO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="estadoCivil">Estado civil</FieldLabel>
                <Select
                  name="estadoCivil"
                  items={ESTADO_CIVIL_ITEMS}
                  defaultValue={defaultValues?.estadoCivil ?? undefined}
                >
                  <SelectTrigger id="estadoCivil" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_CIVIL_OPTIONS.map((o) => (
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
                <FieldLabel htmlFor="naturalidade">Naturalidade</FieldLabel>
                <Input
                  id="naturalidade"
                  name="naturalidade"
                  defaultValue={defaultValues?.naturalidade ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="nacionalidade">Nacionalidade</FieldLabel>
                <Input
                  id="nacionalidade"
                  name="nacionalidade"
                  defaultValue={defaultValues?.nacionalidade ?? "Brasileira"}
                />
              </Field>
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="rg">RG</FieldLabel>
                <Input id="rg" name="rg" defaultValue={defaultValues?.rg ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                <Input id="cpf" name="cpf" defaultValue={defaultValues?.cpf ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="escolaridade">Escolaridade</FieldLabel>
                <Select
                  name="escolaridade"
                  items={ESCOLARIDADE_ITEMS}
                  defaultValue={defaultValues?.escolaridade ?? undefined}
                >
                  <SelectTrigger id="escolaridade" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESCOLARIDADE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </Field>

            <Field>
              <FieldLabel htmlFor="profissao">Profissão</FieldLabel>
              <Input id="profissao" name="profissao" defaultValue={defaultValues?.profissao ?? ""} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Contato</FieldLegend>
          <FieldGroup>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="telefone">Telefone fixo</FieldLabel>
                <Input id="telefone" name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="celular">Celular</FieldLabel>
                <Input id="celular" name="celular" defaultValue={defaultValues?.celular ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
              </Field>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Endereço</FieldLegend>
          <FieldGroup>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="cep">CEP</FieldLabel>
                <Input id="cep" name="cep" defaultValue={defaultValues?.cep ?? ""} />
              </Field>
              <Field className="grow-3">
                <FieldLabel htmlFor="endereco">Endereço</FieldLabel>
                <Input id="endereco" name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="numeroCasa">Número</FieldLabel>
                <Input
                  id="numeroCasa"
                  name="numeroCasa"
                  defaultValue={defaultValues?.numeroCasa ?? ""}
                />
              </Field>
            </Field>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="bairro">Bairro</FieldLabel>
                <Input id="bairro" name="bairro" defaultValue={defaultValues?.bairro ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                <Input id="cidade" name="cidade" defaultValue={defaultValues?.cidade ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="uf">UF</FieldLabel>
                <Input id="uf" name="uf" maxLength={2} defaultValue={defaultValues?.uf ?? ""} />
              </Field>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Família</FieldLegend>
          <FieldGroup>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="nomePai">Nome do pai</FieldLabel>
                <Input id="nomePai" name="nomePai" defaultValue={defaultValues?.nomePai ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nomeMae">Nome da mãe</FieldLabel>
                <Input id="nomeMae" name="nomeMae" defaultValue={defaultValues?.nomeMae ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nomeConjuge">Nome do cônjuge</FieldLabel>
                <Input
                  id="nomeConjuge"
                  name="nomeConjuge"
                  defaultValue={defaultValues?.nomeConjuge ?? ""}
                />
              </Field>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Dados eclesiásticos</FieldLegend>
          <FieldGroup>
            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="congregacaoId">Congregação</FieldLabel>
                <Select
                  name="congregacaoId"
                  items={congregacaoItems}
                  defaultValue={
                    defaultValues?.congregacaoId ? String(defaultValues.congregacaoId) : undefined
                  }
                  required
                >
                  <SelectTrigger id="congregacaoId" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {congregacoes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="cargoId">Cargo</FieldLabel>
                <Select
                  name="cargoId"
                  items={cargoItems}
                  defaultValue={defaultValues?.cargoId ? String(defaultValues.cargoId) : undefined}
                >
                  <SelectTrigger id="cargoId" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select
                  name="status"
                  items={STATUS_MEMBRO_ITEMS}
                  defaultValue={defaultValues?.status ?? "ATIVO"}
                  required
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_MEMBRO_OPTIONS.map((o) => (
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
                <FieldLabel htmlFor="formaAdmissao">Forma de admissão</FieldLabel>
                <Select
                  name="formaAdmissao"
                  items={FORMA_ADMISSAO_ITEMS}
                  defaultValue={defaultValues?.formaAdmissao ?? undefined}
                >
                  <SelectTrigger id="formaAdmissao" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMA_ADMISSAO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="dataAdmissao">Data de admissão</FieldLabel>
                <Input
                  id="dataAdmissao"
                  name="dataAdmissao"
                  type="date"
                  defaultValue={defaultValues?.dataAdmissao ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dataConversao">Data de conversão</FieldLabel>
                <Input
                  id="dataConversao"
                  name="dataConversao"
                  type="date"
                  defaultValue={defaultValues?.dataConversao ?? ""}
                />
              </Field>
            </Field>

            <Field orientation="responsive">
              <Field>
                <FieldLabel htmlFor="dataSaida">Data de saída</FieldLabel>
                <Input
                  id="dataSaida"
                  name="dataSaida"
                  type="date"
                  defaultValue={defaultValues?.dataSaida ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="motivoSaida">Motivo da saída</FieldLabel>
                <Input
                  id="motivoSaida"
                  name="motivoSaida"
                  defaultValue={defaultValues?.motivoSaida ?? ""}
                />
              </Field>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Observações</FieldLegend>
          <FieldGroup>
            <Field>
              <Textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                defaultValue={defaultValues?.observacoes ?? ""}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {state.error && <FieldError>{state.error}</FieldError>}

        <div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
