# Kortex

Kortex is a full-stack education management and YKS preparation platform built for institutions, teachers, students, and parents. The product is designed around the Turkish education system, including YKS-focused study flows, institution workflows, parent communication, exam tracking, and student progress monitoring.

This repository is a sanitized public demo of the project. It keeps the real application structure, UI code, backend routes, data models, and mobile app flow visible for portfolio review, while removing private infrastructure, production secrets, and external service credentials.

## What The Project Shows

- A multi-role education platform with institution, teacher, student, and parent flows.
- Product flows shaped around the Turkish education system and YKS preparation process.
- A React-based institution panel for student tracking, exams, attendance, guidance, reports, accounting, content assignments, and notifications.
- A Flutter mobile app for YKS study workflows, question solving, practice screens, parent access, and student-facing progress features.
- A Node.js/Express backend with Prisma models, authentication middleware, scoped routes, reporting endpoints, and demo-safe AI service boundaries.
- A local-first demo setup where API, server, and database connections point to local development services.

## Repository Structure

```text
backend/  Node.js, Express, Prisma, PostgreSQL backend
panel/    React, Vite institution management panel
mobile-app/  Flutter student mobile application
```

## Tech Stack

- Frontend panel: React, TypeScript, Vite, custom CSS, Recharts, Framer Motion, Lucide icons
- Mobile app: Flutter, Dart, Provider, secure/local storage, custom YKS study screens
- Backend: Node.js, Express, Prisma, PostgreSQL, JWT authentication
- Tooling: npm, Flutter SDK, Prisma, local Postgres/Docker workflow

## Demo And Security Notes

This public version is intentionally prepared for code review and portfolio use.

- No `.env` files are included.
- No production API URL is included.
- No API keys, database passwords, Firebase service accounts, logs, build outputs, or dependency folders are included.
- AI and push notification integrations are disabled or mocked in demo mode.
- Frontend API clients point only to local development endpoints.
- Backend database access defaults to local PostgreSQL.
- Google Fonts are kept to preserve the original UI appearance.

## Local Endpoints

```text
Backend:          http://127.0.0.1:8080
API base:         http://127.0.0.1:8080/api
Panel dev server: http://127.0.0.1:5173
Database:         postgresql://yksuser:ykspass@127.0.0.1:5432/yksdb?schema=public
```

## Local Setup

Install dependencies separately in each app folder:

```bash
cd backend
npm install
```

```bash
cd panel
npm install
```

```bash
cd mobile-app
flutter pub get
```

The backend includes a local `.env.example` file and a Docker Compose PostgreSQL setup for demo development.

## Purpose

The goal of this repository is to demonstrate architecture, product thinking, UI implementation, backend organization, and mobile app development across a real education technology project without exposing private customer data or production infrastructure.
