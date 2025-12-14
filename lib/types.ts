export interface User {
  id: string
  email: string
  password: string
  role: "admin" | "manager" | "staff"
  createdAt: string
}

export interface Sweet {
  id: string
  name: string
  category: string
  price: number
  stock: number
  reorderLevel: number
  supplier: string
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryTransaction {
  id: string
  sweetId: string
  type: "IN" | "OUT" | "ADJUSTMENT"
  quantity: number
  reason: string
  performedBy: string
  createdAt: string
}

export interface Sale {
  id: string
  items: Array<{
    sweetId: string
    quantity: number
    price: number
  }>
  total: number
  createdAt: string
  soldBy: string
}
