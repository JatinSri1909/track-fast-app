"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { api } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/types/api"
import { Loader2 } from "lucide-react"

type ChartData = {
  category: string
  amount: number
  percentage: string
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

export function ExpenseChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/expenses/insights')
        setData(response.data.distribution)
      } catch (error) {
        const apiError = error as ApiError
        toast({
          title: "Error",
          description: apiError.response?.data?.message || "Failed to fetch expense insights",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No expense data available
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="amount"
            nameKey="category"
            label={({ category, percentage }) => `${category} (${percentage}%)`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

