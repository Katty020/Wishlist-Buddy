# Wishlist Buddy

A collaborative wishlist application that allows users to create, share, and manage wishlists with friends and family.

![Wishlist Buddy Banner](./screenshots/banner.png)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Database Structure](#database-structure)
- [Assumptions & Limitations](#assumptions--limitations)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)

## ✨ Features

- **User Authentication**: Simple login/signup system
- **Wishlist Management**: Create, view, edit, and delete wishlists
- **Product Management**: Add, edit, and remove products from wishlists
- **Collaboration**: Share wishlists with other users
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Interactive UI**: Animations and transitions for a better user experience

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js (App Router)
  - React
  - TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Lucide React for icons
  - shadcn/ui for UI components

- **Backend**:
  - MongoDB for data storage
  - Next.js API routes for server-side logic

- **State Management**:
  - React Hooks
  - Local storage (for demo purposes)

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional - the app uses a mock MongoDB implementation with localStorage)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/wishlist-buddy.git
   cd wishlist-buddy
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`
   Note: The MongoDB connection is optional as the app uses a mock implementation.

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

Then start the production server:

\`\`\`bash
npm start
# or
yarn start
\`\`\`

## 📱 Usage

1. **Sign Up/Login**: Create an account or log in (any credentials work in demo mode)
2. **Dashboard**: View all your wishlists
3. **Create Wishlist**: Click "Create Wishlist" to add a new wishlist
4. **Add Products**: Open a wishlist and click "Add Product" to add items
5. **Share Wishlist**: Click "Share" to invite others to collaborate
6. **Edit/Delete**: Manage products within your wishlists

## 🗄️ Database Structure

The application uses MongoDB with the following collections:

### Users Collection
\`\`\`typescript
{
  id: string;
  name: string;
  email: string;
}
\`\`\`

### Wishlists Collection
\`\`\`typescript
{
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  products: Product[];
  createdAt: string;
}
\`\`\`

### Products (Embedded in Wishlists)
\`\`\`typescript
{
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  creatorId: string;
  createdAt: string;
}
\`\`\`

## 🔍 Assumptions & Limitations

- **Authentication**: The application uses a mock authentication system with localStorage. In a production environment, you would implement proper authentication with JWT, OAuth, or similar.
- **Database**: The app uses a mock MongoDB implementation that stores data in localStorage. In production, you would connect to a real MongoDB instance.
- **Image Storage**: Product images are stored as URLs. In a production app, you would implement proper image upload and storage.
- **Real-time Updates**: The app doesn't have real-time collaboration features. In production, you might add WebSockets or similar technology.
- **Error Handling**: Basic error handling is implemented. A production app would need more robust error handling and logging.

## 🚀 Future Improvements

### Scaling Considerations

1. **Real Database Integration**:
   - Replace the mock MongoDB implementation with a real MongoDB connection
   - Implement proper data validation and error handling
   - Add indexes for performance optimization

2. **Authentication & Security**:
   - Implement proper authentication with JWT or OAuth
   - Add password hashing and security measures
   - Implement role-based access control

3. **Performance Optimizations**:
   - Implement server-side rendering for better SEO
   - Add pagination for large wishlists
   - Optimize image loading and processing

### Feature Enhancements

1. **Real-time Collaboration**:
   - Add WebSockets for real-time updates
   - Implement collaborative editing features
   - Add notifications for wishlist changes

2. **Advanced Product Management**:
   - Add categories and tags for products
   - Implement product search and filtering
   - Add price tracking from external sources

3. **Social Features**:
   - Add comments and reactions to products
   - Implement user profiles and activity feeds
   - Add social sharing options

4. **Mobile App**:
   - Develop native mobile apps using React Native
   - Add offline support and synchronization
   - Implement push notifications

## 📸 Screenshots

*Note: Replace these placeholder instructions with actual screenshots of your application*

### Landing Page
![Landing Page](./screenshots/landing.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Wishlist Detail
![Wishlist Detail](./screenshots/wishlist.png)

### Add Product Dialog
![Add Product](./screenshots/add-product.png)

### Share Wishlist Dialog
![Share Wishlist](./screenshots/share.png)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

---

Made with ❤️ by [Your Name]
