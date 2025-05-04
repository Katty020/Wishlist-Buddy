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
import { Mail, Share2, X } from "lucide-react"
import { motion } from "framer-motion"

interface ShareWishlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShareWishlist: (emails: string[]) => void
}

export default function ShareWishlistDialog({ open, onOpenChange, onShareWishlist }: ShareWishlistDialogProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddEmail = () => {
    if (currentEmail && isValidEmail(currentEmail) && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    onShareWishlist(emails)

    // Reset form
    setEmails([])
    setCurrentEmail("")
    setIsSubmitting(false)
  }

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-purple-100 shadow-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white">
            <Share2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
            Share wishlist 👯
          </DialogTitle>
          <DialogDescription className="text-center">
            Invite others to collaborate on this wishlist in real-time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700">
                Email address
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    className="pl-10 border-purple-100 focus:border-violet-300"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddEmail}
                  disabled={!currentEmail || !isValidEmail(currentEmail)}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                >
                  Add
                </Button>
              </div>
            </div>
            {emails.length > 0 && (
              <div className="border border-purple-100 rounded-md p-3 bg-purple-50">
                <Label className="text-sm text-gray-600 mb-2 block">Invited emails:</Label>
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full px-3 py-1 text-sm"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-white hover:text-white/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                type="submit"
                disabled={isSubmitting || emails.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
              >
                {isSubmitting ? "Sharing..." : "Share Wishlist 🚀"}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
