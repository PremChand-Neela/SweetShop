"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Sweet } from "@/lib/types"

interface StockAdjustmentDialogProps {
  sweet: Sweet | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (sweetId: string, quantity: number, type: "IN" | "OUT" | "ADJUSTMENT", reason: string) => void
}

export function StockAdjustmentDialog({ sweet, open, onOpenChange, onSubmit }: StockAdjustmentDialogProps) {
  const [type, setType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sweet) return

    onSubmit(sweet.id, quantity, type, reason)
    onOpenChange(false)
    setQuantity(0)
    setReason("")
    setType("IN")
  }

  if (!sweet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock: {sweet.name}</DialogTitle>
          <DialogDescription>Current stock: {sweet.stock} units</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as "IN" | "OUT" | "ADJUSTMENT")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">Stock In (Add)</SelectItem>
                <SelectItem value="OUT">Stock Out (Remove)</SelectItem>
                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Enter reason for adjustment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">New Stock Level:</p>
            <p className="text-2xl font-bold">
              {type === "OUT" ? sweet.stock - quantity : sweet.stock + quantity} units
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Adjustment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
