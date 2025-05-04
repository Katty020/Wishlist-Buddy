"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Edit,
  Gift,
  Heart,
  MessageCircle,
  Plus,
  Share2,
  ShoppingBag,
  Smile,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import type { Wishlist, Product } from "@/types/wishlist"
import type { User as UserType } from "@/types/user"
import Header from "@/components/header"
import AddProductDialog from "@/components/add-product-dialog"
import EditProductDialog from "@/components/edit-product-dialog"
import ShareWishlistDialog from "@/components/share-wishlist-dialog"
import { formatCurrency } from "@/lib/utils"
import { wishlistService, userService } from "@/lib/mongodb" // Import MongoDB services

export default function WishlistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    const userStr = localStorage.getItem("currentUser")
    if (!userStr) {
      router.push("/login")
      return
    }

    const currentUser = JSON.parse(userStr)
    setUser(currentUser)

    const loadData = async () => {
      try {
        setIsLoading(true)

        const allUsers = await userService.getAllUsers()
        setUsers(allUsers)
        const foundWishlist = await wishlistService.getWishlistById(params.id)

        if (!foundWishlist) {
          toast({
            title: "Wishlist not found ❌",
            description: "The wishlist you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setWishlist(foundWishlist)
      } catch (error) {
        console.error("Error loading wishlist data:", error)

        // Fallback to localStorage if MongoDB fails
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
        setUsers(allUsers)

        const storedWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")
        const foundWishlist = storedWishlists.find((w: Wishlist) => w.id === params.id)

        if (!foundWishlist) {
          toast({
            title: "Wishlist not found ❌",
            description: "The wishlist you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setWishlist(foundWishlist)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, router])

  const handleAddProduct = async (newProduct: Omit<Product, "id" | "creatorId" | "createdAt">) => {
    if (!user || !wishlist) return

    try {
      const productToAdd = {
        creatorId: user.id,
        createdAt: new Date().toISOString(),
        ...newProduct,
      }

      // Add product using MongoDB service
      await wishlistService.addProductToWishlist(wishlist.id, productToAdd)

      // Get updated wishlist
      const updatedWishlist = await wishlistService.getWishlistById(wishlist.id)
      if (updatedWishlist) {
        setWishlist(updatedWishlist)
      }

      toast({
        title: "Product added 🎉",
        description: `"${newProduct.name}" has been added to the wishlist.`,
      })

      setIsAddProductDialogOpen(false)
    } catch (error) {
      console.error("Error adding product:", error)

      // Fallback to localStorage if MongoDB fails
      const productToAdd: Product = {
        id: Date.now().toString(),
        creatorId: user.id,
        createdAt: new Date().toISOString(),
        ...newProduct,
      }

      // Get existing wishlists
      const existingWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")

      // Find and update the current wishlist
      const updatedWishlists = existingWishlists.map((w: Wishlist) => {
        if (w.id === wishlist.id) {
          return {
            ...w,
            products: [...w.products, productToAdd],
          }
        }
        return w
      })

      localStorage.setItem("wishlists", JSON.stringify(updatedWishlists))

      // Update state
      setWishlist({
        ...wishlist,
        products: [...wishlist.products, productToAdd],
      })

      toast({
        title: "Product added 🎉",
        description: `"${productToAdd.name}" has been added to the wishlist.`,
      })

      setIsAddProductDialogOpen(false)
    }
  }

  const handleEditProduct = async (updatedProduct: Product) => {
    if (!wishlist) return

    try {
      // Update product using MongoDB service
      await wishlistService.updateProductInWishlist(wishlist.id, updatedProduct.id, updatedProduct)

      // Get updated wishlist
      const updatedWishlist = await wishlistService.getWishlistById(wishlist.id)
      if (updatedWishlist) {
        setWishlist(updatedWishlist)
      }

      toast({
        title: "Product updated ✅",
        description: `"${updatedProduct.name}" has been updated.`,
      })

      setIsEditProductDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error updating product:", error)

      // Fallback to localStorage if MongoDB fails
      // Get existing wishlists
      const existingWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")

      // Find and update the current wishlist
      const updatedWishlists = existingWishlists.map((w: Wishlist) => {
        if (w.id === wishlist.id) {
          return {
            ...w,
            products: w.products.map((p: Product) => (p.id === updatedProduct.id ? updatedProduct : p)),
          }
        }
        return w
      })

      // Save to localStorage
      localStorage.setItem("wishlists", JSON.stringify(updatedWishlists))

      // Update state
      setWishlist({
        ...wishlist,
        products: wishlist.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
      })

      toast({
        title: "Product updated ✅",
        description: `"${updatedProduct.name}" has been updated.`,
      })

      setIsEditProductDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!wishlist) return

    try {
      // Remove product using MongoDB service
      await wishlistService.removeProductFromWishlist(wishlist.id, productId)

      // Get updated wishlist
      const updatedWishlist = await wishlistService.getWishlistById(wishlist.id)
      if (updatedWishlist) {
        setWishlist(updatedWishlist)
      }

      toast({
        title: "Product removed 🗑️",
        description: "The product has been removed from the wishlist.",
      })
    } catch (error) {
      console.error("Error removing product:", error)

      // Fallback to localStorage if MongoDB fails
      // Get existing wishlists
      const existingWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")

      // Find and update the current wishlist
      const updatedWishlists = existingWishlists.map((w: Wishlist) => {
        if (w.id === wishlist.id) {
          return {
            ...w,
            products: w.products.filter((p: Product) => p.id !== productId),
          }
        }
        return w
      })

      // Save to localStorage
      localStorage.setItem("wishlists", JSON.stringify(updatedWishlists))

      // Update state
      setWishlist({
        ...wishlist,
        products: wishlist.products.filter((p) => p.id !== productId),
      })

      toast({
        title: "Product removed 🗑️",
        description: "The product has been removed from the wishlist.",
      })
    }
  }

  const handleShareWishlist = async (emails: string[]) => {
    if (!wishlist || !user) return

    try {
      // In a real app, this would send invitations to these emails
      // For our mock version, we'll just add them as members if they exist as users

      // Find users by email using MongoDB service
      const foundUsers: UserType[] = []

      for (const email of emails) {
        const foundUser = await userService.getUserByEmail(email)
        if (foundUser && foundUser.id !== user.id) {
          foundUsers.push(foundUser)
        }
      }

      // Get IDs of found users
      const foundUserIds = foundUsers.map((u) => u.id)

      // Add members to wishlist
      for (const userId of foundUserIds) {
        await wishlistService.addMemberToWishlist(wishlist.id, userId)
      }

      // Get updated wishlist
      const updatedWishlist = await wishlistService.getWishlistById(wishlist.id)
      if (updatedWishlist) {
        setWishlist(updatedWishlist)
      }

      toast({
        title: "Wishlist shared 🎉",
        description: `Invited ${foundUsers.length} users to collaborate on this wishlist.`,
      })

      setIsShareDialogOpen(false)
    } catch (error) {
      console.error("Error sharing wishlist:", error)

      // Fallback to localStorage if MongoDB fails
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Find users by email
      const foundUsers = existingUsers.filter((u: UserType) => emails.includes(u.email) && u.id !== user.id)

      // Get IDs of found users
      const foundUserIds = foundUsers.map((u: UserType) => u.id)

      // Get existing wishlists
      const existingWishlists = JSON.parse(localStorage.getItem("wishlists") || "[]")

      // Find and update the current wishlist
      const updatedWishlists = existingWishlists.map((w: Wishlist) => {
        if (w.id === wishlist.id) {
          // Add new members, avoiding duplicates
          const updatedMembers = Array.from(new Set([...w.members, ...foundUserIds]))
          return {
            ...w,
            members: updatedMembers,
          }
        }
        return w
      })

      // Save to localStorage
      localStorage.setItem("wishlists", JSON.stringify(updatedWishlists))

      // Update state
      const updatedWishlist = updatedWishlists.find((w: Wishlist) => w.id === wishlist.id)
      if (updatedWishlist) {
        setWishlist(updatedWishlist)
      }

      toast({
        title: "Wishlist shared 🎉",
        description: `Invited ${foundUsers.length} users to collaborate on this wishlist.`,
      })

      setIsShareDialogOpen(false)
    }
  }

  const getUserName = (userId: string) => {
    const foundUser = users.find((u) => u.id === userId)
    return foundUser ? foundUser.name : "Unknown User"
  }

  // Function to get a random emoji for each product
  const getRandomEmoji = (index: number) => {
    const emojis = ["🎁", "💝", "✨", "🛍️", "💫", "🌟", "🎀", "🎊", "🎈", "🎯"]
    return emojis[index % emojis.length]
  }

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Gift className="h-10 w-10 text-pink-500" />
          </div>
          <p className="text-gray-600">Loading your wishlist from MongoDB...</p>
        </div>
      </div>
    )
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-600">Wishlist not found</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      <Header user={user} />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-lg border border-purple-100"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              {wishlist.name} ✨
            </h1>
            <p className="text-gray-600 mt-1">{wishlist.description}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Created {new Date(wishlist.createdAt).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <Users size={14} />
              <span>{wishlist.members.length + 1} collaborators</span>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsShareDialogOpen(true)}
                variant="outline"
                className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              >
                <Share2 size={16} className="text-purple-500" />
                Share
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddProductDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                <Plus size={16} />
                Add Product
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {wishlist.products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100"
          >
            <div className="mx-auto h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-indigo-500" />
            </div>
            <h2 className="mt-4 text-xl font-medium">No products yet 🛍️</h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Add your first product to this wishlist and start collaborating!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
              <Button
                onClick={() => setIsAddProductDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                <Plus size={16} />
                Add First Product
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full overflow-hidden border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <Gift className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                      {getRandomEmoji(index)}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{product.name}</CardTitle>
                      <div className="text-lg font-bold text-pink-600">{formatCurrency(product.price)}</div>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-gray-500">
                      <User size={14} className="text-indigo-400" />
                      Added by {getUserName(product.creatorId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
                        <Heart size={12} className="inline mr-1" /> Wishlist Item
                      </div>
                      <div className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
                        <Calendar size={12} className="inline mr-1" />{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedProduct(product)
                        setIsEditProductDialogOpen(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleDeleteProduct(product.id)
                      }}
                      className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                  <div className="px-4 pb-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1 border-purple-100 hover:bg-purple-50 text-purple-600"
                    >
                      <MessageCircle size={14} />
                      Comment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1 border-amber-100 hover:bg-amber-50 text-amber-600"
                    >
                      <Smile size={14} />
                      React
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AddProductDialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
        onAddProduct={handleAddProduct}
      />

      <EditProductDialog
        open={isEditProductDialogOpen}
        onOpenChange={setIsEditProductDialogOpen}
        product={selectedProduct}
        onEditProduct={handleEditProduct}
      />

      <ShareWishlistDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        onShareWishlist={handleShareWishlist}
      />
    </div>
  )
}
