"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { date: "Jan 1", predictions: 12, highRisk: 3, mediumRisk: 4, lowRisk: 5 },
  { date: "Jan 2", predictions: 18, highRisk: 5, mediumRisk: 6, lowRisk: 7 },
  { date: "Jan 3", predictions: 15, highRisk: 2, mediumRisk: 5, lowRisk: 8 },
  { date: "Jan 4", predictions: 22, highRisk: 6, mediumRisk: 8, lowRisk: 8 },
  { date: "Jan 5", predictions: 19, highRisk: 4, mediumRisk: 7, lowRisk: 8 },
  { date: "Jan 6", predictions: 25, highRisk: 7, mediumRisk: 9, lowRisk: 9 },
  { date: "Jan 7", predictions: 23, highRisk: 5, mediumRisk: 8, lowRisk: 10 },
]

export function PredictionChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="predictions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
