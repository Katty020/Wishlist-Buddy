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
import { Textarea } from "@/components/ui/textarea"
import { Gift, Sparkles } from "lucide-react"
import type { Wishlist } from "@/types/wishlist"
import { motion } from "framer-motion"

interface CreateWishlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateWishlist: (wishlist: Omit<Wishlist, "id" | "creatorId" | "members" | "products">) => void
}

export default function CreateWishlistDialog({ open, onOpenChange, onCreateWishlist }: CreateWishlistDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    onCreateWishlist({
      name,
      description,
      createdAt: new Date().toISOString(),
    })

    // Reset form
    setName("")
    setDescription("")
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-purple-100 shadow-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white">
            <Gift className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Create a new wishlist ✨
          </DialogTitle>
          <DialogDescription className="text-center">
            Create a wishlist to start adding products and collaborating with others.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
                <Input
                  id="name"
                  placeholder="Birthday Wishlist"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 border-purple-100 focus:border-violet-300"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Items I'd like for my birthday 🎂"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-purple-100 focus:border-violet-300 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                type="submit"
                disabled={isSubmitting || !name}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                {isSubmitting ? "Creating..." : "Create Wishlist 🎁"}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
