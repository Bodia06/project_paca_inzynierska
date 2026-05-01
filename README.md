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

- **Node.js & Express** — Server environment and framework.
- **Sequelize (ORM)** — PostgreSQL database interaction.
- **PostgreSQL** — Relational database.
- **JWT (JSON Web Token)** — Secure authorization.
- **Bcrypt** — Password hashing.
- **Multer** — File upload handling (e.g., user avatars).

---

## 🏗 Architecture & User Roles

### **Core Database Entities**

- **Users**: Stores user data with various roles.
- **Banks**: System for simulating bank operations and balance verification.
- **Vacancies**: Job postings from employers.
- **Solutions**: Task solutions submitted by developers.

### **Available Roles**

1. **Beginner**: Complete learning tasks, submit solutions via GitHub, and track rating/balance.
2. **Employer**: Create and moderate vacancies, review submissions, and hire developers.
3. **Moderator**: Content control and system update verification.

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

### 2. Open Database and loading Seedes

```bash
cd server
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 2. Setup the Server

```bash
npm start
```

## 🔐 Test Accounts (Seeds)

After running the seeds, the following accounts are available for testing:

| Role          | Email                | Password          |
| :------------ | :------------------- | :---------------- |
| **Moderator** | `moderator@test.com` | `!Moder123456`    |
| **Employer**  | `employer@test.com`  | `!Employer123456` |
| **Beginner**  | `beginner@test.com`  | `!Beginner123456` |
