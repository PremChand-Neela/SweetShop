"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { sweetsService } from "@/lib/sweets-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    lowStockCount: 0,
    totalProducts: 0,
    recentSales: [] as any[],
  })

  useEffect(() => {
    if (user) {
      const data = sweetsService.getAnalytics()
      setAnalytics(data)
    }
  }, [user])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSales}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{analytics.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items need restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales recorded yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.recentSales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{sale.items.length} items</p>
                      <p className="text-sm text-muted-foreground">{new Date(sale.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sale.soldBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium">Average Sale</p>
                  <p className="text-sm text-muted-foreground">Per transaction</p>
                </div>
              </div>
              <p className="text-xl font-bold">
                ${analytics.totalSales > 0 ? (analytics.totalRevenue / analytics.totalSales).toFixed(2) : "0.00"}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">Stock Health</p>
                  <p className="text-sm text-muted-foreground">Items status</p>
                </div>
              </div>
              <p className="text-xl font-bold">
                {analytics.totalProducts > 0
                  ? Math.round(((analytics.totalProducts - analytics.lowStockCount) / analytics.totalProducts) * 100)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
