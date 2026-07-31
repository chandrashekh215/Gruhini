# 🥘 GRUHINI — Full-Stack Marketplace (Node.js/Express + React/Vite)

> **"Ghar Jaisa Khana, Ghar Ke Log"**  
> A modern, complete full-stack marketplace connecting local home chefs with food lovers looking for authentic, fresh, homemade meals.

---

## 📸 Screenshots & Preview

| Home Page | Explore Products | Product Details |
| :---: | :---: | :---: |
| ![Home Page](home-page.png) | ![Products](products.png) | ![Product Details](product-details.png) |

---

## 🌟 Key Features

- 🔐 **Multi-Role Security**: JWT token authentication with role-based access control (`ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_USER`).
- 🍳 **Home Chef & Seller Management**: Dashboard for publishing dishes, managing inventory, and tracking order updates.
- 🛒 **Dynamic Shopping Cart & Ordering**: Real-time cart management, dish filtering, and order lifecycle management.
- ⚡ **High-Performance gRPC Microservice**: Built-in gRPC `ProductService` (`@grpc/grpc-js`) running alongside standard REST APIs.
- 📧 **Automated Email Service**: Order OTP verification, password resets, and notifications powered by `Nodemailer`.
- 🖼️ **Cloud Media Storage**: Image upload handling using `Multer` and `Cloudinary`.
- 🗄️ **Relational Database & Caching**: PostgreSQL schema managed via `Prisma ORM` with `Redis` query caching support.

---

## 🏗️ Architecture & Monorepo Layout

```
gruhini-fullstack/
├── docker-compose.yml           # PostgreSQL 15 & Redis 7 local development services
├── README.md
├── package.json                 # Monorepo workspace configuration
├── frontend/                    # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── src/
│       ├── context/             # Auth & Cart State
│       ├── lib/                 # REST API Client & gRPC Product bindings
│       └── pages/               # Home, Explore, Cart, Orders, Seller & Admin Dashboards
└── backend/                     # Node.js + Express + TypeScript + Prisma ORM
    ├── package.json
    ├── Dockerfile
    ├── prisma/
    │   └── schema.prisma        # Database Models & PostgreSQL Schema
    └── src/
        ├── controllers/         # Auth, User, Cart, Order, Seller, Admin
        ├── grpc/                # gRPC Product Service (@grpc/grpc-js)
        ├── middlewares/         # JWT Auth & Role Access Control
        └── utils/               # Mailer (Nodemailer), Cloudinary, Firebase
```

---

## 💻 Tech Stack

### **Backend**
- **Runtime**: Node.js, Express, TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Caching & Sessions**: Redis, `connect-redis`
- **Microservices**: gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`)
- **Authentication**: JWT (`jsonwebtoken`), `bcryptjs`
- **File Uploads & Mailing**: `multer`, `cloudinary`, `nodemailer`

### **Frontend**
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Icons & UI Utilities**: Lucide React, `clsx`, `tailwind-merge`
- **Routing**: React Router DOM

---

## ⚡ Local Setup & Development

Follow these steps to run the complete full-stack project locally:

### 1. Start Local Infrastructure (PostgreSQL + Redis)
Ensure Docker Desktop is running, then start the containers:

```bash
docker-compose up -d
```

### 2. Setup & Start Backend (Express + Prisma)
From the project root:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
*The Express REST server will run on `http://localhost:5000` and the gRPC service on `port 50051`.*

### 3. Setup & Start Frontend (React + Vite)
In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```
*The React application will open on `http://localhost:5173`.*

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gruhini_db"
PORT=5000
JWT_SECRET="your_jwt_secret_key"
REDIS_URL="redis://localhost:6379"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Nodemailer SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:5000"
```

---

## 🚀 Production Deployment Guide

### Option 1: Render Web Service (Backend)
1. **Repository Link**: Connect your Git repository.
2. **Environment**: Select **Node**.
3. **Build Command**: `cd backend && npm install && npm run build`
4. **Start Command**: `cd backend && npm start`
5. **Environment Variables**:
   - `DATABASE_URL`: Production PostgreSQL Connection String
   - `JWT_SECRET`: Secure secret string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Option 2: Render Static Site (Frontend)
1. **Build Command**: `cd frontend && npm install && npm run build`
2. **Publish Directory**: `frontend/dist`
3. **Environment Variables**:
   - `VITE_API_BASE_URL`: Set to your deployed Render backend URL (e.g. `https://gruhani-backend.onrender.com`).
