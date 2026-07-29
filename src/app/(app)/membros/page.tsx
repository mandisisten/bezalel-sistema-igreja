"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { orderBy } from "firebase/firestore";
import { Plus, UserRound } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useCollectionData } from "@/lib/firestore-hooks";
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
import type { CongregacaoInput } from "../congregacoes/actions";
import type { CargoInput } from "../cargos/actions";
import type { MembroInput } from "./actions";

const STATUS_ITEMS = toSelectItems(STATUS_MEMBRO_OPTIONS);

function MembrosContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const congregacaoId = params.get("congregacaoId") ?? "";
  const cargoId = params.get("cargoId") ?? "";
  const status = params.get("status") ?? "";

  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: cargos } = useCollectionData<CargoInput>("cargos", [orderBy("ordem", "asc")]);
  const { data: membros, loading } = useCollectionData<MembroInput>("membros", [
    orderBy("nomeCompleto", "asc"),
  ]);

  const filtrados = useMemo(() => {
    return membros.filter((m) => {
      if (congregacaoId && m.congregacaoId !== congregacaoId) return false;
      if (cargoId && m.cargoId !== cargoId) return false;
      if (status && m.status !== status) return false;
      if (q) {
        const termo = q.toLowerCase();
        const alvo = `${m.nomeCompleto} ${m.cpf ?? ""}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });
  }, [membros, congregacaoId, cargoId, status, q]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Membros</h1>
          <p className="text-muted-foreground">{filtrados.length} membro(s) encontrado(s).</p>
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
          defaultValue={q}
          className="max-w-xs"
        />
        <Select
          name="congregacaoId"
          items={Object.fromEntries(congregacoes.map((c) => [c.id, c.nome]))}
          defaultValue={congregacaoId || undefined}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Congregação" />
          </SelectTrigger>
          <SelectContent>
            {congregacoes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          name="cargoId"
          items={Object.fromEntries(cargos.map((c) => [c.id, c.nome]))}
          defaultValue={cargoId || undefined}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            {cargos.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="status" items={STATUS_ITEMS} defaultValue={status || undefined}>
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
        {(q || congregacaoId || cargoId || status) && (
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
            {filtrados.map((m) => (
              <TableRow key={m.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/membros/editar?id=${m.id}`} className="flex items-center gap-3">
                    {m.fotoUrl ? (
                      <Image
                        src={m.fotoUrl}
                        alt={m.nomeCompleto}
                        width={32}
                        height={32}
                        unoptimized
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
                <TableCell>{m.congregacaoNome ?? "—"}</TableCell>
                <TableCell>{m.cargoNome ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={m.status === "ATIVO" ? "secondary" : "outline"}>
                    {optionLabel(STATUS_MEMBRO_OPTIONS, m.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtrados.length === 0 && (
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

export default function MembrosPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<p className="text-muted-foreground">Carregando...</p>}>
        <MembrosContent />
      </Suspense>
    </AuthGuard>
  );
}
