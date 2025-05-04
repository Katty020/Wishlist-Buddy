

import type { Wishlist } from "@/types/wishlist"
import type { User } from "@/types/user"

class MongoClient {
  private static instance: MongoClient
  private connected = false
  private readonly uri: string = "mongodb+srv://wishlist-buddy:password@cluster0.mongodb.net/wishlist-buddy"

  private constructor() {
    console.log("MongoDB client initialized")
  }

  public static getInstance(): MongoClient {
    if (!MongoClient.instance) {
      MongoClient.instance = new MongoClient()
    }
    return MongoClient.instance
  }

  public async connect(): Promise<void> {
    console.log("Connecting to MongoDB...")
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.connected = true
    console.log("Connected to MongoDB")
  }

  public async close(): Promise<void> {
    console.log("Disconnecting from MongoDB...")
    this.connected = false
    console.log("Disconnected from MongoDB")
  }

  public isConnected(): boolean {
    return this.connected
  }

  public db(name: string): Database {
    if (!this.connected) {
      console.warn("MongoDB client not connected. Attempting to connect...")
      this.connect()
    }
    return new Database(name)
  }
}

class Database {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  public collection<T>(name: string): Collection<T> {
    return new Collection<T>(this.name, name)
  }
}
class Collection<T> {
  private dbName: string
  private collectionName: string

  constructor(dbName: string, collectionName: string) {
    this.dbName = dbName
    this.collectionName = collectionName
  }

  private getStorageKey(): string {
    return this.collectionName
  }

  public async find(query: any = {}): Promise<T[]> {
    console.log(`MongoDB: Finding documents in ${this.collectionName} with query:`, query)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]") as T[]

    if (Object.keys(query).length === 0) {
      return items
    }

    // Basic query filtering (very simplified)
    return items.filter((item) => {
      for (const key in query) {
        if (key.startsWith("$")) continue // Skip MongoDB operators

        // @ts-ignore - Dynamic access
        if (item[key] !== query[key]) {
          return false
        }
      }
      return true
    })
  }

  public async findOne(query: any): Promise<T | null> {
    console.log(`MongoDB: Finding one document in ${this.collectionName} with query:`, query)
    const items = await this.find(query)
    return items.length > 0 ? items[0] : null
  }

  public async findById(id: string): Promise<T | null> {
    console.log(`MongoDB: Finding document by ID in ${this.collectionName}:`, id)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]") as any[]
    const item = items.find((item) => item.id === id)
    return item || null
  }

  public async insertOne(document: Partial<T>): Promise<{ insertedId: string }> {
    console.log(`MongoDB: Inserting document into ${this.collectionName}:`, document)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]")

    // @ts-ignore - Adding ID
    const newDocument = { ...document, _id: new ObjectId().toString() }
    items.push(newDocument)

    localStorage.setItem(this.getStorageKey(), JSON.stringify(items))

    // @ts-ignore - Accessing ID
    return { insertedId: newDocument._id }
  }

  public async insertMany(documents: Partial<T>[]): Promise<{ insertedIds: string[] }> {
    console.log(`MongoDB: Inserting multiple documents into ${this.collectionName}:`, documents)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]")

    const insertedIds: string[] = []

    for (const document of documents) {
      // @ts-ignore - Adding ID
      const newDocument = { ...document, _id: new ObjectId().toString() }
      items.push(newDocument)
      // @ts-ignore - Accessing ID
      insertedIds.push(newDocument._id)
    }

    localStorage.setItem(this.getStorageKey(), JSON.stringify(items))

    return { insertedIds }
  }

  public async updateOne(query: any, update: any): Promise<{ modifiedCount: number }> {
    console.log(`MongoDB: Updating document in ${this.collectionName} with query:`, query)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]") as any[]

    let modifiedCount = 0

    const updatedItems = items.map((item) => {
      let matches = true

      for (const key in query) {
        if (key.startsWith("$")) continue // Skip MongoDB operators
        if (item[key] !== query[key]) {
          matches = false
          break
        }
      }

      if (matches) {
        modifiedCount++

        if (update.$set) {
          return { ...item, ...update.$set }
        }

        if (update.$push) {
          const result = { ...item }
          for (const key in update.$push) {
            if (!result[key]) result[key] = []
            result[key].push(update.$push[key])
          }
          return result
        }

        if (update.$pull) {
          const result = { ...item }
          for (const key in update.$pull) {
            if (!result[key]) continue
            const pullValue = update.$pull[key]
            result[key] = result[key].filter((val: any) => val !== pullValue)
          }
          return result
        }

        return { ...item, ...update }
      }

      return item
    })

    localStorage.setItem(this.getStorageKey(), JSON.stringify(updatedItems))

    return { modifiedCount }
  }

  public async deleteOne(query: any): Promise<{ deletedCount: number }> {
    console.log(`MongoDB: Deleting document from ${this.collectionName} with query:`, query)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]") as any[]

    let deletedCount = 0
    let foundIndex = -1

    for (let i = 0; i < items.length; i++) {
      let matches = true

      for (const key in query) {
        if (key.startsWith("$")) continue // Skip MongoDB operators
        if (items[i][key] !== query[key]) {
          matches = false
          break
        }
      }

      if (matches) {
        foundIndex = i
        break
      }
    }

    if (foundIndex !== -1) {
      items.splice(foundIndex, 1)
      deletedCount = 1
      localStorage.setItem(this.getStorageKey(), JSON.stringify(items))
    }

    return { deletedCount }
  }

  public async deleteMany(query: any): Promise<{ deletedCount: number }> {
    console.log(`MongoDB: Deleting multiple documents from ${this.collectionName} with query:`, query)
    const items = JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]") as any[]

    const filteredItems = items.filter((item) => {
      for (const key in query) {
        if (key.startsWith("$")) continue // Skip MongoDB operators
        if (item[key] === query[key]) {
          return false
        }
      }
      return true
    })

    const deletedCount = items.length - filteredItems.length

    localStorage.setItem(this.getStorageKey(), JSON.stringify(filteredItems))

    return { deletedCount }
  }
}

class ObjectId {
  private id: string

  constructor() {
    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  toString(): string {
    return this.id
  }
}

// MongoDB service for wishlists
export const wishlistService = {
  async getAllWishlists(): Promise<Wishlist[]> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")
      return await collection.find()
    } finally {

    }
  },

  async getWishlistById(id: string): Promise<Wishlist | null> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")
      return await collection.findById(id)
    } finally {
      // await client.close()
    }
  },

  async getUserWishlists(userId: string): Promise<Wishlist[]> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")
      const allWishlists = await collection.find()

      // Filter wishlists that the user created or is a member of
      return allWishlists.filter((wishlist) => wishlist.creatorId === userId || wishlist.members.includes(userId))
    } finally {
      // await client.close()
    }
  },

  async createWishlist(wishlist: Omit<Wishlist, "id">): Promise<Wishlist> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")

      const newWishlist = {
        ...wishlist,
        id: new ObjectId().toString(),
      } as Wishlist

      await collection.insertOne(newWishlist)
      return newWishlist
    } finally {
      // await client.close()
    }
  },

  async updateWishlist(id: string, update: Partial<Wishlist>): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")
      await collection.updateOne({ id }, { $set: update })
    } finally {
      // await client.close()
    }
  },

  async deleteWishlist(id: string): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")
      await collection.deleteOne({ id })
    } finally {
      // await client.close()
    }
  },

  async addProductToWishlist(wishlistId: string, product: any): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")

      const wishlist = await collection.findById(wishlistId)
      if (!wishlist) throw new Error("Wishlist not found")

      const productWithId = {
        ...product,
        id: new ObjectId().toString(),
      }

      await collection.updateOne({ id: wishlistId }, { $push: { products: productWithId } })
    } finally {
      // await client.close()
    }
  },

  async updateProductInWishlist(wishlistId: string, productId: string, update: any): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")

      const wishlist = await collection.findById(wishlistId)
      if (!wishlist) throw new Error("Wishlist not found")

      const updatedProducts = wishlist.products.map((p) => (p.id === productId ? { ...p, ...update } : p))

      await collection.updateOne({ id: wishlistId }, { $set: { products: updatedProducts } })
    } finally {
      // await client.close()
    }
  },

  async removeProductFromWishlist(wishlistId: string, productId: string): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")

      const wishlist = await collection.findById(wishlistId)
      if (!wishlist) throw new Error("Wishlist not found")

      const updatedProducts = wishlist.products.filter((p) => p.id !== productId)

      await collection.updateOne({ id: wishlistId }, { $set: { products: updatedProducts } })
    } finally {
      // await client.close()
    }
  },

  async addMemberToWishlist(wishlistId: string, userId: string): Promise<void> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<Wishlist>("wishlists")

      await collection.updateOne({ id: wishlistId }, { $push: { members: userId } })
    } finally {
      // await client.close()
    }
  },
}

// MongoDB service for users
export const userService = {
  async getUserById(id: string): Promise<User | null> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<User>("users")
      return await collection.findById(id)
    } finally {
      // await client.close()
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<User>("users")
      return await collection.findOne({ email })
    } finally {
      // await client.close()
    }
  },

  async createUser(user: Omit<User, "id">): Promise<User> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<User>("users")

      const newUser = {
        ...user,
        id: new ObjectId().toString(),
      } as User

      await collection.insertOne(newUser)
      return newUser
    } finally {
      // await client.close()
    }
  },

  async getAllUsers(): Promise<User[]> {
    const client = MongoClient.getInstance()
    await client.connect()

    try {
      const db = client.db("wishlist-buddy")
      const collection = db.collection<User>("users")
      return await collection.find()
    } finally {
      // await client.close()
    }
  },
}

// Initialize MongoDB connection
export const initMongoDB = async (): Promise<void> => {
  const client = MongoClient.getInstance()
  await client.connect()
  console.log("MongoDB initialized successfully")
}
