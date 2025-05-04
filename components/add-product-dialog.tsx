"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, ImageIcon, ShoppingBag, Tag } from "lucide-react"
import type { Product } from "@/types/wishlist"
import { motion } from "framer-motion"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: Omit<Product, "id" | "creatorId" | "createdAt">) => void
}

export default function AddProductDialog({ open, onOpenChange, onAddProduct }: AddProductDialogProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    onAddProduct({
      name,
      price: Number.parseFloat(price) || 0,
      imageUrl: imageUrl || null,
    })

    // Reset form
    setName("")
    setPrice("")
    setImageUrl("")
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-purple-100 shadow-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Add a new product 🛍️
          </DialogTitle>
          <DialogDescription className="text-center">
            Add a product to your wishlist with details and an optional image.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Product Name
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                <Input
                  id="name"
                  placeholder="Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 border-purple-100 focus:border-violet-300"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-gray-700">
                Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="pl-10 border-purple-100 focus:border-violet-300"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl" className="text-gray-700">
                Image URL (optional)
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="pl-10 border-purple-100 focus:border-violet-300"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                type="submit"
                disabled={isSubmitting || !name || !price}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
              >
                {isSubmitting ? "Adding..." : "Add Product ✨"}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
