"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SERIES_BLUE = "#2a78d6";
const GRID = "#e1e0d9";
const AXIS_TEXT = "#898781";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{payload[0].value} membro(s)</div>
    </div>
  );
}

export function BarStat({
  title,
  data,
}: {
  title: string;
  data: { label: string; total: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={{ stroke: GRID }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(42,120,214,0.08)" }} />
            <Bar dataKey="total" fill={SERIES_BLUE} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function GrowthChart({ data }: { data: { label: string; total: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crescimento de membros (12 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={{ stroke: GRID }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(42,120,214,0.08)" }} />
            <Bar dataKey="total" fill={SERIES_BLUE} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
