"use client"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Heart, PartyPopper, ShoppingBag, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser")
    if (user) {
      redirect("/dashboard")
    }
  }

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const floatingIconVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-pink-50">
      <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Wishlist</span>
            <span className="text-indigo-600">Buddy</span>
            <PartyPopper className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pink-200 opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-200 opacity-50 blur-3xl"></div>

          <div className="container relative z-10">
            <motion.div
              className="flex flex-col items-center text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center gap-3">
                <motion.div variants={floatingIconVariants} animate="animate">
                  <Gift className="h-8 w-8 text-pink-500" />
                </motion.div>
                <motion.div variants={floatingIconVariants} animate="animate" transition={{ delay: 0.5 }}>
                  <Heart className="h-8 w-8 text-red-500" />
                </motion.div>
                <motion.div variants={floatingIconVariants} animate="animate" transition={{ delay: 1 }}>
                  <ShoppingBag className="h-8 w-8 text-indigo-500" />
                </motion.div>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight">
                Create and Share Wishlists <br />
                <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  Together
                </span>{" "}
                ✨
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-6 max-w-[600px] text-gray-600 md:text-xl">
                Plan shopping sprees 🛍️, organize gift ideas 🎁, and collaborate with friends and family in real-time 🤝
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-lg"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-4"
            >
              How It Works <Sparkles className="inline h-6 w-6 text-amber-400" />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Three simple steps to create and share your perfect wishlist with friends and family
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-2xl flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Create a Wishlist 📝</h3>
                <p className="text-gray-600">
                  Start by creating a wishlist for any occasion or purpose. Birthday, wedding, or just because!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Add Products 🛍️</h3>
                <p className="text-gray-600">
                  Add items with names, images, and prices to your wishlist. Keep track of everything you want.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-violet-400 to-violet-600 text-white rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Invite Friends 👯</h3>
                <p className="text-gray-600">
                  Share your wishlist with friends and collaborate in real-time. Perfect for group planning!
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 text-white text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started? 🚀</h2>
              <p className="max-w-2xl mx-auto mb-8">
                Join thousands of users who are already organizing their wishlists and collaborating with friends and
                family.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="gap-2 text-indigo-600 font-medium">
                    Create Your First Wishlist
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-purple-100 py-8 bg-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent font-bold">
              Wishlist Buddy
            </span>
            <PartyPopper className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-sm text-gray-500">© 2025 Wishlist Buddy. All rights reserved. ✨</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
