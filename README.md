# GRUHINI — Full-Stack Marketplace (Node.js/Express + React/Vite)

> **"Ghar Jaisa Khana, Ghar Ke Log"**  
> A complete full-stack marketplace connecting local home chefs with food lovers craving authentic, homemade meals.

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
    │   └── schema.prisma        # Replicated JPA Entity PostgreSQL Schema
    └── src/
        ├── controllers/         # Auth, User, Cart, Order, Seller, Admin
        ├── grpc/                # gRPC Product Service (@grpc/grpc-js)
        ├── middlewares/         # JWT Auth & Role Access Control
        └── utils/               # Mailer (Nodemailer), Cloudinary, Firebase
```

---

## ⚡ STEP 5 — Local Run Instructions

Follow these exact steps to run the complete full-stack project locally:

### 1. Start Local Infrastructure (PostgreSQL + Redis)
Ensure Docker Desktop is running, then start the containers:

```bash
docker-compose up -d
```

### 2. Setup & Start Backend (Express + Prisma)
Open a terminal in the root directory:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
*The Express REST server will run on `http://localhost:5000` and the gRPC service on `port 50051`.*

### 3. Setup & Start Frontend (React + Vite)
Open a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```
*The React application will open on `http://localhost:5173`.*

---

## 🚀 STEP 6 — Render Production Deployment Guide

### Option 1: Render Web Service (Backend)
1. **Repository Link**: Connect your Git repository.
2. **Environment**: Select **Node**.
3. **Build Command**: `cd backend && npm install && npm run build`
4. **Start Command**: `cd backend && npm start`
5. **Environment Variables**:
   - `DATABASE_URL`: Production PostgreSQL Connection String (Render Postgres)
   - `JWT_SECRET`: Secure secret string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Option 2: Render Static Site (Frontend)
1. **Build Command**: `cd frontend && npm install && npm run build`
2. **Publish Directory**: `frontend/dist`
3. **Environment Variables**:
   - `VITE_API_BASE_URL`: Set to your deployed Render backend URL (e.g. `https://gruhani-backend.onrender.com`).

---

## 🔍 STEP 7 — Conversion Gaps & Substitutions Audit

| Original Spring Boot Feature | Node.js Conversion / Substitution | Rationale / Notes |
|---|---|---|
| **Spring Data JPA / Hibernate** | **Prisma ORM (PostgreSQL)** | Directly mapped all models (`Users`, `Seller`, `Product`, `Order`, `Cart`, etc.) with identical field constraints. |
| **Spring Security Filter Chain** | **Express `jwtAuthMiddleware` + `requireRole`** | Replicated zero-trust JWT token validation and role-based access control (`ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_USER`). |
| **Spring Mail (`JavaMailSender`)** | **`nodemailer`** | Recreated the exact HTML email templates for order OTPs, password reset, and seller notifications. |
| **Cloudinary Java SDK** | **`cloudinary` Node SDK + Multer** | Multipart image uploads for product additions and profile picture updates. |
| **OpenSearch Configuration** | **Prisma Direct Filter & Caching** | OpenSearch client in Spring was unused in core REST path; replaced with fast relational queries & Redis cache support. |
| **Google Cloud Vision (OCR)** | **Fallback Upload Handler** | Vision API OCR was commented out in Java `image_to_cart.java`; cleanly handled standard image uploads. |
| **gRPC `product.proto`** | **`@grpc/grpc-js` + `@grpc/proto-loader`** | Runs real gRPC ProductService server alongside standard REST `/explore`. |
