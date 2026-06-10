# 🚀 IT-Academy: Career Path Platform

**IT-Academy** is a modern platform for learning and employment specifically designed for beginner developers. The project is built on **React 19** and **Vite**, ensuring high performance and a seamless interface for managing tasks, system updates, and job vacancies.

This ecosystem combines the functionality of an educational portal and a job board, providing a transparent path from the first learning task to receiving a job offer.

---

## 🛠 Tech Stack

### **Frontend (Client)**

- **React 19** — UI library for building the user interface.
- **Vite** — Next-generation frontend tooling.
- **Redux Toolkit** — Global state management (slices, async thunks).
- **React Router DOM v7** — Routing and navigation management.
- **Formik & Yup** — Complex form handling and data validation.
- **Axios** — HTTP client for API interaction.
- **Use-Query-Params** — Syncing filters and pagination with the URL.
- **React Icons & Lucide React** — Modern icon sets.
- **React Credit Cards 2** — Interactive credit card visualization.

### **Backend (Server)**

- **Node.js (v18.x) & Express** — Server environment and scalable framework.
- **Sequelize (ORM)** — PostgreSQL database interaction (Migrations, Seeders).
- **PostgreSQL (v15.x)** — Relational database engine.
- **MinIO Object Storage** — Self-hosted AWS S3 compatible system for managing static assets (avatars, program images).
- **AWS SDK for JavaScript (v3)** — Native S3 clients for secure data upload and automated cloud cleanup.
- **JWT (JSON Web Token)** — Secure role-based authorization.
- **Bcrypt** — Password hashing.
- **Multer** — File upload handling via memory buffers.

---

## 🏗 Architecture & User Roles

### **Core Database Entities**

- **Users**: Stores profile data, security parameters, and tracking balances.
- **Banks**: System for simulating banking operations and balance verification.
- **Vacancies**: Job postings managed from the Employer side.
- **Solutions**: Freelance task submissions submitted by target developers.
- **Tasks**: Curated assignment modules built for students.
- **Infos**: Centralized system update and documentation logs.

### **Available Roles**

1. **Beginner**: Complete learning tasks, submit code solutions via GitHub links, and track earned balances.
2. **Employer**: Create and fund active vacancies, review student submissions, and issue instant payouts.
3. **Moderator**: Core content management, verification of code submissions, and handling platform updates.

---

## 🐋 Infrastructure Management (Docker Compose)

The entire microservice architecture is orchestrated using **Docker** and **Docker Compose**. The application is divided into four isolated containers working inside a secure unified network:

| Container Name     | Service                    | Exposed Port               | Volume / Data              |
| :----------------- | :------------------------- | :------------------------- | :------------------------- |
| `project_frontend` | React + Vite Development   | `5173`                     | Source Code Hot-Reloading  |
| `project_backend`  | Express API Node Server    | `5001`                     | Environment Syncing        |
| `project_postgres` | PostgreSQL Database Engine | `5432`                     | `pgdata` Persistent Volume |
| `project_minio`    | MinIO Storage / S3 Engine  | `9000` (API) / `9001` (UI) | `miniodata` Asset Volume   |

---

## 📦 Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Setup the Client

```bash
cd client
npm install
npm run dev
```

### 3. Open Database and loading Seedes

```bash
cd server
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Setup the Server

```bash
npm start
```

### 5. How to Run and Test in Docker Containers

Once your configuration is complete, starting the platform takes just one command. Open your terminal in the project root directory and run:

```bash
./start.sh
```
### 6. Test settings for .env
# --- SERVER CONFIGURATION ---
PORT=5001
HOST=0.0.0.0
NODE_ENV=development

# --- SECURITY & AUTHENTICATION ---
JWT_SECRET=super_secret_key_123456789_change_me
JWT_EXPIRES_IN=24h

# --- POSTGRESQL DATABASE CONFIGURATION ---
DATABASE_USER_NAME=myuser
DATABASE_PASSWORD=mypassword
DATABASE_NAME=mydb
DATABASE_HOST=postgres
DATABASE_PORT=5432

# --- MINIO / S3 CONFIGURATION ---
MINIO_ENDPOINT_URL=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_BUCKET_NAME=my-bucket
