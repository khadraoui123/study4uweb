# 🌌 Study4u AI — Neural Academic Operating System

## 📖 Overview
Study4u AI is a next-generation educational operating system designed to transform how students manage learning, productivity, focus, and academic growth.

The platform combines:
*   🧠 **Artificial Intelligence**
*   📊 **Cognitive analytics**
*   ⚡ **Real-time scheduling**
*   🎯 **Gamified productivity**
*   🔐 **Secure authentication**
*   ☁️ **Modern cloud-ready architecture**

into one premium academic workspace.

---

## 🖥️ Neural Interface Previews

### 🔐 Authentication Gateways
| Sign In Interface | Sign Up Interface |
| :---: | :---: |
| ![Sign In](scrishot/login.png) | ![Sign Up](scrishot/register.png) |

### 🧠 Workspace Interfaces
| Neural Academic Dashboard | Advanced Planner & Focus Console |
| :---: | :---: |
| ![Dashboard](scrishot/page1.png) | ![Planner](scrishot/page2.png) |

---

## 🏗️ System Architecture
The platform is separated into 3 isolated services for scalability and maintainability.

```
study4u-ai/
│
├── frontend/        → React + Vite Client (Root workspace)
├── backend/         → Express REST API
├── database/        → PostgreSQL Container
└── docker-compose.yml
```

---

## ⚡ Tech Stack

### 🎨 Frontend — Neural Interface
| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI rendering |
| **TypeScript** | Type-safe architecture |
| **Vite** | Ultra-fast development |
| **Zustand** | Lightweight state management |
| **Framer Motion** | Smooth animations |
| **Tailwind / Vanilla CSS** | Glassmorphism UI system |

### 🧠 Backend — Core API Engine
| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Runtime |
| **Express.js** | REST API |
| **TypeScript** | Backend typing |
| **Prisma ORM** | Database layer |
| **JWT** | Authentication |
| **bcrypt** | Password encryption |

### 🗄️ Database — Academic Node
| Technology | Purpose |
| :--- | :--- |
| **PostgreSQL** | Main relational database |
| **Docker Compose** | Container orchestration |

---

## 🚀 Installation Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/study4u-ai.git
cd study4u-ai
```

### 🐳 Step 1 — Start PostgreSQL Database
Run the Docker container:
```bash
docker compose up -d
```
This launches PostgreSQL securely on: `localhost:5432`

### 🔥 Step 2 — Configure Backend
Move into the backend folder:
```bash
cd backend
npm install
```

#### ⚙️ Configure Environment Variables
Create a `.env` file inside `/backend`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/study4u"
JWT_SECRET="study4u_secret_key"
PORT=3001
```

#### 🧬 Sync Prisma Schema
```bash
npm run db:push
```

#### 🌱 Seed Database
```bash
npm run db:seed
```
This automatically generates:
*   Demo users
*   AI memory nodes
*   Academic entries
*   Study metrics
*   Scheduling data

#### ▶️ Launch Backend Server
```bash
npm run dev
```
Backend is available on: `http://localhost:3001`

### 🎨 Step 3 — Launch Frontend
Open another terminal:
```bash
npm install
npm run dev
```
Frontend is available on: `http://localhost:5173`

---

## 🔐 Authentication Flow
Study4u AI includes a secure production-grade authentication system.

### Login Flow (`/login`)
Users authenticate using:
*   Email
*   Password
*   JWT Token System

### Registration Flow (`/register`)
New users can initialize accounts through:
*   The platform automatically creates a **User Profile**, **AI Memory Node**, **Academic Metrics**, and **Productivity Records** in a single transaction.

### Silent Auto-Login
After registration:
*   ✅ JWT token generated
*   ✅ User session initialized
*   ✅ Dashboard preloaded
*   ✅ Redirect to Command Center

---

## 🧠 Core Features

*   📊 **AI Productivity Dashboard:** Real-time analytics, academic progress tracking, XP & leveling system, performance metrics.
*   🗓️ **Intelligent Scheduling:** Dynamic calendar, AI-generated study sessions, smart reminders, cognitive intensity tracking.
*   🎯 **Gamification System:** XP rewards, achievement system, streak tracking, level progression.
*   🧠 **AI Memory Engine:** Persistent AI memory system capable of remembering study habits, tracking academic goals, and personalizing recommendations.

---

## 🧪 Production Build

### Frontend Build
```bash
npm run build
```
Compiles optimized frontend into: `/dist`

### Backend Build (Inside `/backend`)
```bash
npm run build
```
Compiles TypeScript backend into optimized production bundle.

---

## 🐳 Docker Services
Example `docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16
    container_name: study4u-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: study4u
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📦 Recommended Scripts

### Root `package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Backend `package.json`
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🌐 Suggested Deployment
| Service | Platform |
| :--- | :--- |
| **Frontend** | Vercel |
| **Backend** | Render / Railway |
| **Database** | Neon / Supabase |

---

## 📌 GitHub Best Practices
Recommended `.gitignore`
```gitignore
node_modules
dist
.env
coverage
.vscode
.DS_Store
```

---

## 👨💻 Development Philosophy
Study4u AI is designed around:
*   Scalability
*   Clean Architecture
*   AI-first UX
*   Real-time responsiveness
*   Production-ready engineering
