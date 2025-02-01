"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddExpenseDialog } from "@/components/layout/add-expense-dialog"
import { EditExpenseDialog } from "@/components/layout/edit-expense-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Pencil, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { expenseApi } from "@/services/api"
import { ExpenseFormData } from "@/types/expense"
import { ApiError } from "@/types/api"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { ExpenseChart } from "@/components/layout/expense-chart"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"

export type Expense = {
  _id: string
  amount: number
  category: string
  date: string
  description: string
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const { toast } = useToast()
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    category: '',
    search: '',
    sort: 'date' as const,
    order: 'desc' as const
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  })
  
  const categories = [
    "All",
    "Food",
    "Travel",
    "Entertainment",
    "Shopping",
    "Bills",
    "Other"
  ]

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const { expenses, pagination } = await expenseApi.getExpenses(filters)
      setExpenses(expenses)
      setPagination(pagination)
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Failed to fetch expenses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [filters])

  const handleAddExpense = async (newExpense: ExpenseFormData) => {
    try {
      await expenseApi.addExpense(newExpense)
      toast({
        title: "Success",
        description: "Expense added successfully",
      })
      fetchExpenses()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Failed to add expense",
        variant: "destructive",
      })
    }
  }

  const handleEditExpense = async (id: string, updatedExpense: ExpenseFormData) => {
    try {
      await expenseApi.updateExpense(id, updatedExpense)
      toast({
        title: "Success",
        description: "Expense updated successfully",
      })
      fetchExpenses()
      setSelectedExpense(null)
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Failed to update expense",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseApi.deleteExpense(id)
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      })
      fetchExpenses()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Failed to delete expense",
        variant: "destructive",
      })
    }
  }

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setFilters(prev => ({
      ...prev,
      startDate: range.from.toISOString(),
      endDate: range.to.toISOString(),
      page: 1
    }))
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === "all" ? "" : category,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }))
  }

  const handleSearchChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }))
  }, 300)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <AddExpenseDialog onAddExpense={handleAddExpense} />
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search expenses..."
            onChange={handleSearchChange}
            defaultValue={filters.search}
            className="w-[200px]"
          />
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker onChange={handleDateRangeChange} className="w-[300px]" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Table Section - Takes up 3 columns */}
        <div className="lg:col-span-3">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Amount</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin inline-block" />
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense._id} className="h-[52px]">
                      <TableCell className="font-medium">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">
                        {expense.description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedExpense(expense)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this expense? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteExpense(expense._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(filters.page - 1)}
                    aria-disabled={filters.page <= 1}
                    className={filters.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <div className="flex items-center px-4">
                    Page {filters.page} of {pagination.pages}
                  </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(filters.page + 1)}
                    aria-disabled={filters.page >= pagination.pages}
                    className={filters.page >= pagination.pages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* Chart Section - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4 h-full">
            <ExpenseChart />
          </div>
        </div>
      </div>

      {selectedExpense && (
        <EditExpenseDialog
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onSave={handleEditExpense}
        />
      )}
    </div>
  )
}

