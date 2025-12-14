"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { sweetsService } from "@/lib/sweets-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { InventoryTransaction, Sweet } from "@/lib/types"
import { ArrowDown, ArrowUp, RefreshCcw } from "lucide-react"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [sweets, setSweets] = useState<Sweet[]>([])

  useEffect(() => {
    if (user) {
      const allTransactions = sweetsService.getTransactions()
      const allSweets = sweetsService.getAll()
      setTransactions(allTransactions.reverse())
      setSweets(allSweets)
    }
  }, [user])

  const getSweetName = (sweetId: string) => {
    const sweet = sweets.find((s) => s.id === sweetId)
    return sweet?.name || "Unknown Product"
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowDown className="w-4 h-4 text-green-500" />
      case "OUT":
        return <ArrowUp className="w-4 h-4 text-red-500" />
      default:
        return <RefreshCcw className="w-4 h-4 text-blue-500" />
    }
  }

  const getVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "IN":
        return "default"
      case "OUT":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <p className="text-muted-foreground">View all inventory adjustments</p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No transactions recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({transactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="mt-1">{getIcon(transaction.type)}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold">{getSweetName(transaction.sweetId)}</p>
                        <p className="text-sm text-muted-foreground">{transaction.reason}</p>
                      </div>
                      <Badge variant={getVariant(transaction.type)}>
                        {transaction.type === "IN" ? "+" : transaction.type === "OUT" ? "-" : "±"}
                        {transaction.quantity}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                      <span>By: {transaction.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
