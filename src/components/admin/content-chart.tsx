"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ContentChartProps {
  data: { name: string; count: number }[]
}

export function ContentChart({ data }: ContentChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            border: "2px solid black",
            borderRadius: "5px",
            background: "white",
            boxShadow: "4px 4px 0px 0px black",
          }}
        />
        <Bar dataKey="count" fill="oklch(53.75% 0.158 159.45)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
