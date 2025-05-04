"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Gift, LogOut, Menu, PartyPopper, User, X } from "lucide-react"
import type { User as UserType } from "@/types/user"
import { motion } from "framer-motion"

interface HeaderProps {
  user: UserType
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  return (
    <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/dashboard" className="flex items-center">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Wishlist</span>
            <span className="text-indigo-600">Buddy</span>
            <PartyPopper className="h-5 w-5 text-amber-400 ml-1" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="block md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Gift size={16} className="text-pink-500" />
            Dashboard
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                <User size={16} className="text-indigo-500" />
                <span>{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-purple-100 shadow-lg">
              <DropdownMenuItem disabled className="opacity-70">
                <span className="text-gray-500">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 focus:text-rose-600 cursor-pointer">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-50 bg-white p-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                className="text-lg py-3 border-b border-purple-100 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gift size={20} className="text-pink-500" />
                Dashboard
              </Link>
              <div className="py-3 border-b border-purple-100">
                <div className="font-medium flex items-center gap-2">
                  <User size={20} className="text-indigo-500" />
                  {user.name}
                </div>
                <div className="text-sm text-gray-500 ml-7">{user.email}</div>
              </div>
              <Button
                variant="ghost"
                className="justify-start text-rose-500 px-0 py-3 hover:bg-rose-50"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
