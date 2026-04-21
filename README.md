# 🛒 Campus Marketplace

Campus Marketplace is a full-stack web application designed specifically for college and university students to buy, sell, and exchange items safely and conveniently within their campus community. 

## ✨ Features

- **User Authentication:** Secure login and registration using JSON Web Tokens (JWT) and password hashing with `bcryptjs`.
- **Product Listings:** Users can easily upload and manage items for sale, including uploading images via `multer`.
- **Wishlist:** Save products to your wishlist to keep track of items you are interested in.
- **Dynamic Theming:** Built-in Light and Dark mode using React Context API for an optimal viewing experience.
- **Protected Routes:** Secure routes ensuring only authenticated users can access the dashboard, sell items, or view their wishlist.
- **Responsive Design:** A beautiful, responsive user interface built with modern UI principles and Tailwind CSS.
- **Admin Dashboard:** Role-based access control for managing users and overall marketplace listings.

## 🛠️ Technology Stack

**Frontend:**
- React (bootstrapped with Vite)
- Tailwind CSS
- React Router DOM
- Context API (State Management)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (Authentication)
- Multer (File Uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd campus-marketplace
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev  # (or node server.js)
   ```

3. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd backend/frontend-react
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 📁 Project Structure

```
campus-marketplace/
├── backend/
│   ├── controllers/      # Route controllers (logic)
│   ├── middleware/       # Custom Express middleware (auth, upload)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express API routes
│   ├── uploads/          # Locally uploaded files/images
│   ├── server.js         # Entry point for backend
│   └── frontend-react/   # React Frontend Application
│       ├── src/
│       │   ├── components/ # Reusable UI components
│       │   ├── context/    # React Context (Theme, Auth)
│       │   ├── pages/      # Route pages (Home, Dashboard, etc.)
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
└── README.md
```

## 📞 Support & Contact

- **Email:** shivhareanay513@gmail.com
- **Availability:** 24*7

---
*Made with ❤️ for campus communities.*
