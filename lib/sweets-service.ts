"use client"

import type { Sweet, InventoryTransaction, Sale } from "./types"

const SWEETS_KEY = "sweet_shop_sweets"
const TRANSACTIONS_KEY = "sweet_shop_transactions"
const SALES_KEY = "sweet_shop_sales"

export const sweetsService = {
  // Sweets CRUD
  getAll: (): Sweet[] => {
    return JSON.parse(localStorage.getItem(SWEETS_KEY) || "[]")
  },

  getById: (id: string): Sweet | null => {
    const sweets = sweetsService.getAll()
    return sweets.find((s) => s.id === id) || null
  },

  create: (sweet: Omit<Sweet, "id" | "createdAt" | "updatedAt">): Sweet => {
    const sweets = sweetsService.getAll()
    const newSweet: Sweet = {
      ...sweet,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    sweets.push(newSweet)
    localStorage.setItem(SWEETS_KEY, JSON.stringify(sweets))
    return newSweet
  },

  update: (id: string, updates: Partial<Sweet>): Sweet => {
    const sweets = sweetsService.getAll()
    const index = sweets.findIndex((s) => s.id === id)

    if (index === -1) {
      throw new Error("Sweet not found")
    }

    sweets[index] = {
      ...sweets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(SWEETS_KEY, JSON.stringify(sweets))
    return sweets[index]
  },

  delete: (id: string): void => {
    const sweets = sweetsService.getAll()
    const filtered = sweets.filter((s) => s.id !== id)
    localStorage.setItem(SWEETS_KEY, JSON.stringify(filtered))
  },

  // Inventory Management
  getLowStock: (): Sweet[] => {
    const sweets = sweetsService.getAll()
    return sweets.filter((s) => s.stock <= s.reorderLevel)
  },

  adjustStock: (
    sweetId: string,
    quantity: number,
    type: "IN" | "OUT" | "ADJUSTMENT",
    reason: string,
    performedBy: string,
  ): void => {
    const sweet = sweetsService.getById(sweetId)
    if (!sweet) throw new Error("Sweet not found")

    const newStock = type === "OUT" ? sweet.stock - quantity : sweet.stock + quantity

    sweetsService.update(sweetId, { stock: newStock })

    // Record transaction
    const transactions: InventoryTransaction[] = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || "[]")
    transactions.push({
      id: Date.now().toString(),
      sweetId,
      type,
      quantity,
      reason,
      performedBy,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  },

  getTransactions: (): InventoryTransaction[] => {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || "[]")
  },

  // Sales
  recordSale: (items: Array<{ sweetId: string; quantity: number }>, soldBy: string): Sale => {
    const sales: Sale[] = JSON.parse(localStorage.getItem(SALES_KEY) || "[]")

    let total = 0
    const saleItems = items.map((item) => {
      const sweet = sweetsService.getById(item.sweetId)
      if (!sweet) throw new Error(`Sweet ${item.sweetId} not found`)

      if (sweet.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${sweet.name}`)
      }

      // Reduce stock
      sweetsService.adjustStock(item.sweetId, item.quantity, "OUT", "Sale", soldBy)

      const itemTotal = sweet.price * item.quantity
      total += itemTotal

      return {
        sweetId: item.sweetId,
        quantity: item.quantity,
        price: sweet.price,
      }
    })

    const sale: Sale = {
      id: Date.now().toString(),
      items: saleItems,
      total,
      soldBy,
      createdAt: new Date().toISOString(),
    }

    sales.push(sale)
    localStorage.setItem(SALES_KEY, JSON.stringify(sales))
    return sale
  },

  getSales: (): Sale[] => {
    return JSON.parse(localStorage.getItem(SALES_KEY) || "[]")
  },

  // Analytics
  getAnalytics: () => {
    const sweets = sweetsService.getAll()
    const sales = sweetsService.getSales()
    const transactions = sweetsService.getTransactions()

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalSales = sales.length
    const lowStockCount = sweetsService.getLowStock().length
    const totalProducts = sweets.length

    return {
      totalRevenue,
      totalSales,
      lowStockCount,
      totalProducts,
      recentSales: sales.slice(-10).reverse(),
      recentTransactions: transactions.slice(-10).reverse(),
    }
  },
}
