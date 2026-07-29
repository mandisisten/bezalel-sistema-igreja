"use client";

import { useMemo } from "react";
import Link from "next/link";
import { orderBy, where } from "firebase/firestore";
import { Users, Building2, Cake, UserPlus } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/firebase-auth";
import { useCollectionData } from "@/lib/firestore-hooks";
import { formatTimestamp } from "@/lib/firestore-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarStat, GrowthChart } from "./charts";
import type { CongregacaoInput } from "../congregacoes/actions";
import type { CargoInput } from "../cargos/actions";
import type { MembroInput } from "../membros/actions";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const STAT_COLORS = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
} as const;

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: keyof typeof STAT_COLORS;
}) {
  return (
    <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-3 py-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${STAT_COLORS[color]}`}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { profile } = useAuth();
  const { data: membrosAtivos } = useCollectionData<MembroInput>("membros", [
    where("status", "==", "ATIVO"),
  ]);
  const { data: congregacoes } = useCollectionData<CongregacaoInput>("congregacoes", [
    orderBy("nome", "asc"),
  ]);
  const { data: cargos } = useCollectionData<CargoInput>("cargos", [orderBy("ordem", "asc")]);
  const { data: todosMembros } = useCollectionData<
    MembroInput & { createdAt?: import("firebase/firestore").Timestamp }
  >("membros", []);

  const now = new Date();

  const aniversariantes = useMemo(() => {
    return membrosAtivos
      .filter((m) => m.dataNascimento && m.dataNascimento.toDate().getUTCMonth() === now.getMonth())
      .sort(
        (a, b) => a.dataNascimento!.toDate().getUTCDate() - b.dataNascimento!.toDate().getUTCDate(),
      );
  }, [membrosAtivos, now]);

  const novosMembrosEsteMes = useMemo(() => {
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    return todosMembros.filter((m) => m.createdAt && m.createdAt.toDate() >= inicioMes).length;
  }, [todosMembros, now]);

  const cargoData = useMemo(() => {
    return cargos.map((cargo) => ({
      label: cargo.nome,
      total: todosMembros.filter((m) => m.cargoId === cargo.id).length,
    }));
  }, [cargos, todosMembros]);

  const congregacaoData = useMemo(() => {
    return congregacoes.map((c) => ({
      label: c.nome,
      total: todosMembros.filter((m) => m.congregacaoId === c.id).length,
    }));
  }, [congregacoes, todosMembros]);

  const crescimentoData = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      buckets.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
    }
    for (const m of todosMembros) {
      if (!m.createdAt) continue;
      const d = m.createdAt.toDate();
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).map(([key, total]) => {
      const [, month] = key.split("-");
      return { label: MESES[Number(month)], total };
    });
  }, [todosMembros, now]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo(a), {profile?.nome}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Membros ativos" value={membrosAtivos.length} color="blue" />
        <StatCard icon={Building2} label="Congregações" value={congregacoes.length} color="violet" />
        <StatCard
          icon={Cake}
          label="Aniversariantes no mês"
          value={aniversariantes.length}
          color="amber"
        />
        <StatCard
          icon={UserPlus}
          label="Novos membros este mês"
          value={novosMembrosEsteMes}
          color="emerald"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GrowthChart data={crescimentoData} />
        <BarStat title="Membros por cargo" data={cargoData} />
        <BarStat title="Membros por congregação" data={congregacaoData} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cake className="size-4" />
              Aniversariantes do mês
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {aniversariantes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum aniversariante este mês.</p>
            )}
            {aniversariantes.map((m) => (
              <Link
                key={m.id}
                href={`/membros/editar?id=${m.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-medium">{m.nomeCompleto}</span>
                <span className="text-muted-foreground">{formatTimestamp(m.dataNascimento)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
