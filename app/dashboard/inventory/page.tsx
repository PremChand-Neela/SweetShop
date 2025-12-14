"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { sweetsService } from "@/lib/sweets-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SweetCard } from "@/components/sweet-card"
import { SweetForm } from "@/components/sweet-form"
import { StockAdjustmentDialog } from "@/components/stock-adjustment-dialog"
import type { Sweet } from "@/lib/types"
import { Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InventoryPage() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSweetForm, setShowSweetForm] = useState(false)
  const [showStockDialog, setShowStockDialog] = useState(false)
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  useEffect(() => {
    filterSweets()
  }, [searchQuery, sweets, activeTab])

  const loadData = () => {
    const allSweets = sweetsService.getAll()
    setSweets(allSweets)
  }

  const filterSweets = () => {
    let filtered = sweets

    // Filter by tab
    if (activeTab === "low-stock") {
      filtered = filtered.filter((s) => s.stock <= s.reorderLevel)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredSweets(filtered)
  }

  const handleAddSweet = (data: Omit<Sweet, "id" | "createdAt" | "updatedAt">) => {
    sweetsService.create(data)
    loadData()
  }

  const handleEditSweet = (data: Omit<Sweet, "id" | "createdAt" | "updatedAt">) => {
    if (selectedSweet) {
      sweetsService.update(selectedSweet.id, data)
      setSelectedSweet(null)
      loadData()
    }
  }

  const handleDeleteSweet = (id: string) => {
    if (confirm("Are you sure you want to delete this sweet?")) {
      sweetsService.delete(id)
      loadData()
    }
  }

  const handleStockAdjustment = (
    sweetId: string,
    quantity: number,
    type: "IN" | "OUT" | "ADJUSTMENT",
    reason: string,
  ) => {
    sweetsService.adjustStock(sweetId, quantity, type, reason, user?.email || "Unknown")
    loadData()
  }

  const lowStockCount = sweets.filter((s) => s.stock <= s.reorderLevel).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your sweet shop products</p>
        </div>
        <Button onClick={() => setShowSweetForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sweet
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, category, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Products ({sweets.length})</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock {lowStockCount > 0 && `(${lowStockCount})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredSweets.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">
                {searchQuery ? "No products match your search" : "No products in inventory"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={(sweet) => {
                    setSelectedSweet(sweet)
                    setShowSweetForm(true)
                  }}
                  onDelete={handleDeleteSweet}
                  onAdjustStock={(sweet) => {
                    setSelectedSweet(sweet)
                    setShowStockDialog(true)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="low-stock" className="mt-6">
          {filteredSweets.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No low stock items</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={(sweet) => {
                    setSelectedSweet(sweet)
                    setShowSweetForm(true)
                  }}
                  onDelete={handleDeleteSweet}
                  onAdjustStock={(sweet) => {
                    setSelectedSweet(sweet)
                    setShowStockDialog(true)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SweetForm
        sweet={selectedSweet}
        open={showSweetForm}
        onOpenChange={(open) => {
          setShowSweetForm(open)
          if (!open) setSelectedSweet(null)
        }}
        onSubmit={selectedSweet ? handleEditSweet : handleAddSweet}
      />

      <StockAdjustmentDialog
        sweet={selectedSweet}
        open={showStockDialog}
        onOpenChange={(open) => {
          setShowStockDialog(open)
          if (!open) setSelectedSweet(null)
        }}
        onSubmit={handleStockAdjustment}
      />
    </div>
  )
}
