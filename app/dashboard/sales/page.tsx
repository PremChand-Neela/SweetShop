"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { sweetsService } from "@/lib/sweets-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Sweet, Sale } from "@/lib/types"
import { Plus, Minus, ShoppingCart, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CartItem {
  sweet: Sweet
  quantity: number
}

export default function SalesPage() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = () => {
    const allSweets = sweetsService.getAll()
    const allSales = sweetsService.getSales()
    setSweets(allSweets)
    setSales(allSales.reverse())
  }

  const filteredSweets = sweets.filter(
    (sweet) =>
      sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addToCart = (sweet: Sweet) => {
    if (sweet.stock === 0) {
      setError(`${sweet.name} is out of stock`)
      setTimeout(() => setError(""), 3000)
      return
    }

    const existingItem = cart.find((item) => item.sweet.id === sweet.id)
    if (existingItem) {
      if (existingItem.quantity >= sweet.stock) {
        setError(`Cannot add more. Only ${sweet.stock} items in stock`)
        setTimeout(() => setError(""), 3000)
        return
      }
      setCart(cart.map((item) => (item.sweet.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { sweet, quantity: 1 }])
    }
  }

  const updateQuantity = (sweetId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.sweet.id === sweetId) {
            const newQuantity = item.quantity + delta
            if (newQuantity <= 0) return null
            if (newQuantity > item.sweet.stock) {
              setError(`Only ${item.sweet.stock} items in stock`)
              setTimeout(() => setError(""), 3000)
              return item
            }
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[],
    )
  }

  const removeFromCart = (sweetId: string) => {
    setCart(cart.filter((item) => item.sweet.id !== sweetId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.sweet.price * item.quantity, 0)
  }

  const completeSale = () => {
    if (cart.length === 0) {
      setError("Cart is empty")
      setTimeout(() => setError(""), 3000)
      return
    }

    try {
      const saleItems = cart.map((item) => ({
        sweetId: item.sweet.id,
        quantity: item.quantity,
      }))

      sweetsService.recordSale(saleItems, user?.email || "Unknown")
      setSuccess("Sale completed successfully!")
      setCart([])
      loadData()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Point of Sale</h2>
        <p className="text-muted-foreground">Process customer purchases</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredSweets.map((sweet) => (
              <Card
                key={sweet.id}
                className={`cursor-pointer hover:border-primary transition-colors ${sweet.stock === 0 ? "opacity-50" : ""}`}
                onClick={() => addToCart(sweet)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{sweet.name}</CardTitle>
                      <CardDescription>{sweet.category}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${sweet.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {sweet.stock}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.sweet.id} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.sweet.name}</p>
                          <p className="text-xs text-muted-foreground">${item.sweet.price.toFixed(2)} each</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.sweet.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.sweet.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right w-16">
                          <p className="font-bold text-sm">${(item.sweet.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => removeFromCart(item.sweet.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <Button className="w-full" size="lg" onClick={completeSale}>
                      Complete Sale
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setCart([])}>
                      Clear Cart
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sales recorded yet</p>
          ) : (
            <div className="space-y-2">
              {sales.slice(0, 10).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{sale.items.length} items</p>
                    <p className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleString()}</p>
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
    </div>
  )
}
