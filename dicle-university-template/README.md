# Dicle University Information Portal & Hospital CMS Template

> [!NOTE]
> This project is a custom template designed for **Dicle University**. It is currently a **Work in Progress (~50% completed)**, serving as a functional boilerplate/portfolio demonstration showing modern full-stack integrations.
> 
> Crafted via **Vibe Coding** methodologies (collaborative iteration between developer and AI coding agents).

A modern, feature-rich web application built with **Next.js 16 (App Router, Turbopack)**, **Prisma ORM**, **PostgreSQL**, and **NextAuth.js v5**. This project serves as a comprehensive platform combining an academic university information portal with a medical clinic/hospital management system.

## 🚀 Key Features

### 🏛️ University Information Portal
- **Academic Calendar**: Dynamically managed calendar dates and term schedules.
- **Academic Units**: Manage faculties, vocational schools, research centers, and departments.
- **Student Services CMS**: Links, tools, and services organized for active students.
- **Research Hub**: Showcase scientific centers, highlights, and publications.

### 🏥 Hospital Administration System
- **Polyclinics Manager**: List and edit active clinics, emergency rooms, and medical departments.
- **Hospital Announcements**: Clinic-specific announcements and patient notification systems.
- **Staff Directory**: Administrative and academic doctor profiles with avatars and contact info.

### ⚙️ Rich Admin Dashboard
- **Universal Content CMS**: Add, edit, or delete news, announcements, and campus events.
- **Intelligent AI Chatbot**: Built-in NLP-supported virtual assistant designed to answer visitor questions.
- **PDF Food Menu Parser**: Automatically extract daily soup, main courses, and calories directly from university PDF menus.
- **Audit Logs & Roles**: Comprehensive role-based access control (Admin/User) powered by NextAuth.js.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router, React Server Components)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database Engine**: PostgreSQL
- **Security & Auth**: [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **UI & Components**: TailwindCSS, Framer Motion, Lucide Icons, Radix UI
- **Rich Text Editor**: TipTap Editor Integration
- **File Parser**: `pdf-parse` for automated menu scanning

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- PostgreSQL database instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and define the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/databasename?schema=public"
   AUTH_SECRET="your-32-character-secret-key"
   ```

4. **Initialize Database Schema:**
   Apply Prisma migrations directly to your PostgreSQL instance:
   ```bash
   npx prisma db push
   ```

5. **Seed Sample Data:**
   Populate the database with realistic academic and hospital contents:
   ```bash
   npx tsx prisma/seed-real-content.ts
   npx tsx prisma/seed-staff.ts
   node super-seed.js
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to explore the portal.

---

## 🔒 Security & Admin Access
Authentication is managed via `NextAuth.js`. Admin features are restricted to accounts marked with the `ADMIN` role. 
A default admin user is generated during the database seeding phase. Check seed files for credentials.
