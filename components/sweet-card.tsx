"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Sweet } from "@/lib/types"
import { Edit, Trash2, Package } from "lucide-react"

interface SweetCardProps {
  sweet: Sweet
  onEdit: (sweet: Sweet) => void
  onDelete: (id: string) => void
  onAdjustStock: (sweet: Sweet) => void
}

export function SweetCard({ sweet, onEdit, onDelete, onAdjustStock }: SweetCardProps) {
  const isLowStock = sweet.stock <= sweet.reorderLevel

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl || "/placeholder.svg"} alt={sweet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Package className="w-12 h-12" />
          </div>
        )}
        {isLowStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{sweet.name}</h3>
            <p className="text-sm text-muted-foreground">{sweet.category}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${sweet.price.toFixed(2)}</p>
          </div>
        </div>

        {sweet.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{sweet.description}</p>}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Stock</p>
            <p className={`font-semibold ${isLowStock ? "text-destructive" : ""}`}>{sweet.stock}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Reorder at</p>
            <p className="font-semibold">{sweet.reorderLevel}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Supplier</p>
            <p className="font-semibold">{sweet.supplier}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onAdjustStock(sweet)}>
          <Package className="w-4 h-4 mr-2" />
          Stock
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(sweet)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(sweet.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
