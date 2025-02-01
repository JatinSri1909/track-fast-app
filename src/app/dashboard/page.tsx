import { ExpenseList } from "@/components/layout/expense-list"
import { UserMenu } from "@/components/layout/user-menu"
import { Toaster } from "@/components/ui/toaster"
import { APP_NAME } from "@/lib/constants"
import { Rocket } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{APP_NAME}</h1>
          </div>
          <UserMenu />
        </header>

        <main>
          <ExpenseList />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

