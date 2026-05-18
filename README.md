# 🌌 Study4u AI — Neural Academic Operating System

> A state-of-the-art, high-fidelity academic workspace powered by AI, real-time cognitive metrics, dynamic scheduling, and decentralized database architecture. 

---

## 🚀 Architectural Pillars

Study4u AI is engineered with a modern, high-performance tech stack split into three isolated services:

*   **Frontend (Neural Interface):** Built with **React 19**, **TypeScript**, and **Vite**. Leverages **Zustand** for lightweight in-memory state management, **Framer Motion** for premium desktop-grade micro-animations, and custom **Vanilla CSS** glassmorphism tokens.
*   **Backend (Core API):** Powered by an **Express** REST engine written in **TypeScript** with robust routing, JWT-based security middleware, and a database layer powered by **Prisma ORM**.
*   **Database (Academic Node):** A high-performance **PostgreSQL** instance designed to persist user nodes, AI memories, and academic entries.

---

## 🛠️ Step-by-Step Orchestration Guide

Follow these exact steps to initialize your local database, sync the schemas, and boot the entire platform.

### Step 1: Fire up the Database (Docker Compose)
We have pre-configured a docker-compose container matching the exact database credentials required by the API.

In your terminal (from the project root):
```powershell
docker compose up -d
```
*This starts a local PostgreSQL instance running securely on `localhost:5432`.*

---

### Step 2: Set up the Backend REST API
Navigate into the backend service directory, install dependencies, sync the database schemas, seed mock data, and start the engine:

1.  **Navigate & Install:**
    ```powershell
    cd backend
    npm install
    ```
2.  **Sync Schema (Prisma Push):**
    This pushes your database schema directly to your local PostgreSQL container without manual SQL files:
    ```powershell
    npm run db:push
    ```
3.  **Seed Initial Datasets (Prisma Seed):**
    Pre-loads mockup AI suggestions, course nodes, and academic entries:
    ```powershell
    npm run db:seed
    ```
4.  **Launch API Server:**
    ```powershell
    npm run dev
    ```
    *The core REST engine is now active on `http://localhost:3001`.*

---

### Step 3: Boot the Frontend Neural Interface
Open a separate terminal window at the project root, install packages, and spin up the hot-reloading dev server:

1.  **Navigate & Install:**
    ```powershell
    npm install
    ```
2.  **Launch Web UI:**
    ```powershell
    npm run dev
    ```
    *Your browser will load the portal at `http://localhost:5173/`.*

---

## 🎨 Premium User Authentication Flow

Study4u AI features a production-grade, secure authentication sequence:
1.  **The Entry Gate (Login):** When you open the website, you will land directly on the **Login Page (`/login`)**.
2.  **New Node Creation (Register):** If you are a new user, you can choose to click **"Initialize Profile"** at the bottom to transition to the registration screen.
3.  **Database Integration:** Creating your account will push a new `User`, `AIMemory`, and standard academic records to the database in a single secure SQL transaction.
4.  **Auto-Login & Live Dashboard:** On submission, the app performs a silent handshake, logs you in, pre-loads all your system metrics in the background, and launches you straight to the **OS Command Center**.

---

## 🧪 Production Verification & Build
To build and package the production bundle for deployment, run:

*   **Build Frontend:** `npm run build` (within root folder) — compiles Vite & TS into static `/dist`.
*   **Build Backend:** `npm run build` (within `/backend` folder) — compiles raw TS into optimized CommonJS `/dist`.

Both builds compile flawlessly with **zero errors**.
