import Link from "next/link";
import Image from "next/image";
import { Plus, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_MEMBRO_OPTIONS, optionLabel, toSelectItems } from "@/lib/member-options";

const STATUS_ITEMS = toSelectItems(STATUS_MEMBRO_OPTIONS);
import type { Prisma } from "@/generated/prisma/client";

export default async function MembrosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; congregacaoId?: string; cargoId?: string; status?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const [congregacoes, cargos] = await Promise.all([
    prisma.congregacao.findMany({ orderBy: { nome: "asc" } }),
    prisma.cargo.findMany({ orderBy: { ordem: "asc" } }),
  ]);

  const where: Prisma.MembroWhereInput = {};
  if (params.q) {
    where.OR = [
      { nomeCompleto: { contains: params.q } },
      { cpf: { contains: params.q } },
    ];
  }
  if (params.congregacaoId) where.congregacaoId = Number(params.congregacaoId);
  if (params.cargoId) where.cargoId = Number(params.cargoId);
  if (params.status) where.status = params.status;

  const membros = await prisma.membro.findMany({
    where,
    orderBy: { nomeCompleto: "asc" },
    include: { congregacao: true, cargo: true },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Membros</h1>
          <p className="text-muted-foreground">{membros.length} membro(s) encontrado(s).</p>
        </div>
        <Button nativeButton={false} render={<Link href="/membros/novo" />}>
          <Plus className="size-4" />
          Novo membro
        </Button>
      </div>

      <form className="flex flex-wrap gap-2" method="get">
        <Input
          name="q"
          placeholder="Buscar por nome ou CPF..."
          defaultValue={params.q}
          className="max-w-xs"
        />
        <Select
          name="congregacaoId"
          items={Object.fromEntries(congregacoes.map((c) => [String(c.id), c.nome]))}
          defaultValue={params.congregacaoId}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Congregação" />
          </SelectTrigger>
          <SelectContent>
            {congregacoes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          name="cargoId"
          items={Object.fromEntries(cargos.map((c) => [String(c.id), c.nome]))}
          defaultValue={params.cargoId}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            {cargos.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="status" items={STATUS_ITEMS} defaultValue={params.status}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_MEMBRO_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
        {(params.q || params.congregacaoId || params.cargoId || params.status) && (
          <Button variant="ghost" nativeButton={false} render={<Link href="/membros" />}>
            Limpar
          </Button>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membros.map((m) => (
              <TableRow key={m.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/membros/${m.id}`} className="flex items-center gap-3">
                    {m.fotoUrl ? (
                      <Image
                        src={m.fotoUrl}
                        alt={m.nomeCompleto}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                        <UserRound className="size-4 text-muted-foreground" />
                      </span>
                    )}
                    <span className="font-medium">{m.nomeCompleto}</span>
                  </Link>
                </TableCell>
                <TableCell>{m.congregacao.nome}</TableCell>
                <TableCell>{m.cargo?.nome ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={m.status === "ATIVO" ? "secondary" : "outline"}>
                    {optionLabel(STATUS_MEMBRO_OPTIONS, m.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {membros.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
