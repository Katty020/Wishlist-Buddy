export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string | null
  creatorId: string
  createdAt: string
}

export interface Wishlist {
  id: string
  name: string
  description: string
  creatorId: string
  members: string[]
  products: Product[]
  createdAt: string
}
