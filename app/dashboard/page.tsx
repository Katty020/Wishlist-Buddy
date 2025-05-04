"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Gift, Heart, Plus, ShoppingBag, Sparkles, Star, Users } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import type { Wishlist } from "@/types/wishlist"
import type { User } from "@/types/user"
import Header from "@/components/header"
import CreateWishlistDialog from "@/components/create-wishlist-dialog"
import { wishlistService } from "@/lib/mongodb" 

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    const userStr = localStorage.getItem("currentUser")
    if (!userStr) {
      router.push("/login")
      return
    }

    const currentUser = JSON.parse(userStr)
    setUser(currentUser)

    // Load wishlists using MongoDB service
    const fetchWishlists = async () => {
      try {
        setIsLoading(true)
        // Using MongoDB service to fetch wishlists
        const userWishlists = await wishlistService.getUserWishlists(currentUser.id)
        setWishlists(userWishlists)
      } catch (error) {
        console.error("Error fetching wishlists:", error)
        toast({
          title: "Error loading wishlists",
          description: "There was a problem loading your wishlists. Please try again.",
          variant: "destructive",
        })

        const storedWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")
        const userWishlists = storedWishlists.filter(
          (wishlist: Wishlist) => wishlist.creatorId === currentUser.id || wishlist.members.includes(currentUser.id),
        )
        setWishlists(userWishlists)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlists()
  }, [router])

  const handleCreateWishlist = async (newWishlist: Omit<Wishlist, "id" | "creatorId" | "members" | "products">) => {
    if (!user) return

    try {
      // Create wishlist with MongoDB service
      const wishlistToAdd: Omit<Wishlist, "id"> = {
        creatorId: user.id,
        members: [],
        products: [],
        ...newWishlist,
        createdAt: new Date().toISOString(),
      }

      const createdWishlist = await wishlistService.createWishlist(wishlistToAdd)

      // Update state
      setWishlists([...wishlists, createdWishlist])

      toast({
        title: "Wishlist created 🎉",
        description: `Your wishlist "${createdWishlist.name}" has been created.`,
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating wishlist:", error)
      toast({
        title: "Error creating wishlist",
        description: "There was a problem creating your wishlist. Please try again.",
        variant: "destructive",
      })

      // Fallback to localStorage if MongoDB fails
      const wishlistToAdd: Wishlist = {
        id: Date.now().toString(),
        creatorId: user.id,
        members: [],
        products: [],
        ...newWishlist,
        createdAt: new Date().toISOString(),
      }

      // Get existing wishlists or initialize empty array
      const existingWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")

      // Add new wishlist
      existingWishlists.push(wishlistToAdd)

      localStorage.setItem("wishlists", JSON.stringify(existingWishlists))

      // Update state
      setWishlists([...wishlists, wishlistToAdd])
    }
  }

  const getRandomIcon = (index: number) => {
    const icons = [
      <Gift key="gift" className="h-6 w-6 text-pink-500" />,
      <ShoppingBag key="bag" className="h-6 w-6 text-indigo-500" />,
      <Heart key="heart" className="h-6 w-6 text-red-500" />,
      <Star key="star" className="h-6 w-6 text-amber-500" />,
      <Calendar key="calendar" className="h-6 w-6 text-green-500" />,
      <Sparkles key="sparkles" className="h-6 w-6 text-purple-500" />,
    ]
    return icons[index % icons.length]
  }

  // Function to get a random gradient for each wishlist card
  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-violet-500 to-purple-500",
      "from-amber-400 to-orange-500",
      "from-emerald-500 to-green-500",
      "from-cyan-500 to-teal-500",
    ]
    return gradients[index % gradients.length]
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      <Header user={user} />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Your Wishlists ✨
            </h1>
            <p className="text-gray-600 mt-1">Manage and organize all your wishlists in one place</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
            >
              <Plus size={16} className="text-white" />
              Create Wishlist
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-64 bg-white rounded-2xl shadow-lg border border-purple-100 animate-pulse">
                <div className={`h-2 w-full bg-gradient-to-r ${getRandomGradient(index)} opacity-50`}></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100"
          >
            <div className="mx-auto h-20 w-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-10 w-10 text-pink-500" />
            </div>
            <h2 className="mt-4 text-xl font-medium">No wishlists yet 🎁</h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Create your first wishlist to start organizing your dream items and share with friends!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                <Plus size={16} />
                Create Your First Wishlist
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((wishlist, index) => (
              <motion.div
                key={wishlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link href={`/wishlist/${wishlist.id}`}>
                  <Card className="h-full cursor-pointer overflow-hidden border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`h-2 w-full bg-gradient-to-r ${getRandomGradient(index)}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold">{wishlist.name} ✨</CardTitle>
                        <div className="p-2 rounded-full bg-gray-50">{getRandomIcon(index)}</div>
                      </div>
                      <CardDescription>{wishlist.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <ShoppingBag size={16} className="text-indigo-500" />
                        <span>{wishlist.products.length} items</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="text-pink-500" />
                        <span>{wishlist.members.length + 1} collaborators</span>
                      </div>
                    </CardContent>
                    <CardFooter className="text-xs text-gray-400 border-t pt-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Created {new Date(wishlist.createdAt).toLocaleDateString()}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreateWishlistDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateWishlist={handleCreateWishlist}
      />
    </div>
  )
}
