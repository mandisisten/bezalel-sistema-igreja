import Link from "next/link";
import { Users, Building2, Cake, Droplets, UserPlus, CalendarClock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarStat, GrowthChart } from "./charts";

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const STAT_COLORS = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
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

export default async function DashboardPage() {
  const session = await requireUser();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalAtivos,
    totalCongregacoes,
    batismosEsteAno,
    novosMembrosEsteMes,
    membrosPorCargo,
    membrosPorCongregacao,
    membrosParaAniversario,
    membrosParaCrescimento,
    proximosEventos,
  ] = await Promise.all([
    prisma.membro.count({ where: { status: "ATIVO" } }),
    prisma.congregacao.count(),
    prisma.batismo.count({ where: { data: { gte: startOfYear } } }),
    prisma.membro.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.cargo.findMany({
      orderBy: { ordem: "asc" },
      include: { _count: { select: { membros: true } } },
    }),
    prisma.congregacao.findMany({
      orderBy: { nome: "asc" },
      include: { _count: { select: { membros: true } } },
    }),
    prisma.membro.findMany({
      where: { dataNascimento: { not: null }, status: "ATIVO" },
      select: { id: true, nomeCompleto: true, dataNascimento: true },
    }),
    prisma.membro.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.eventoAgenda.findMany({
      where: { inicio: { gte: now } },
      orderBy: { inicio: "asc" },
      take: 5,
    }),
  ]);

  const aniversariantes = membrosParaAniversario
    .filter((m) => m.dataNascimento!.getUTCMonth() === now.getMonth())
    .sort((a, b) => a.dataNascimento!.getUTCDate() - b.dataNascimento!.getUTCDate());

  const cargoData = membrosPorCargo.map((c) => ({ label: c.nome, total: c._count.membros }));
  const congregacaoData = membrosPorCongregacao.map((c) => ({
    label: c.nome,
    total: c._count.membros,
  }));

  const crescimentoBuckets = new Map<string, number>();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    crescimentoBuckets.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
  }
  for (const m of membrosParaCrescimento) {
    const key = `${m.createdAt.getFullYear()}-${m.createdAt.getMonth()}`;
    if (crescimentoBuckets.has(key)) {
      crescimentoBuckets.set(key, (crescimentoBuckets.get(key) ?? 0) + 1);
    }
  }
  const crescimentoData = Array.from(crescimentoBuckets.entries()).map(([key, total]) => {
    const [, month] = key.split("-");
    return { label: MESES[Number(month)], total };
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo(a), {session.nome}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Membros ativos" value={totalAtivos} color="blue" />
        <StatCard icon={Building2} label="Congregações" value={totalCongregacoes} color="violet" />
        <StatCard
          icon={Cake}
          label="Aniversariantes no mês"
          value={aniversariantes.length}
          color="amber"
        />
        <StatCard icon={Droplets} label="Batismos este ano" value={batismosEsteAno} color="sky" />
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
              <CalendarClock className="size-4" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {proximosEventos.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum evento futuro agendado.</p>
            )}
            {proximosEventos.map((e) => (
              <Link
                key={e.id}
                href={`/agenda/${e.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-medium">{e.titulo}</span>
                <span className="text-muted-foreground">{formatDateTime(e.inicio)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cake className="size-4" />
              Aniversariantes do mês
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {aniversariantes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum aniversariante este mês.
              </p>
            )}
            {aniversariantes.map((m) => (
              <Link
                key={m.id}
                href={`/membros/${m.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-medium">{m.nomeCompleto}</span>
                <span className="text-muted-foreground">{formatDate(m.dataNascimento)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
