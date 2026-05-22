# AI-Agent Orchestrated Development (Vibe Coding Case Study)

This repository serves as a portfolio demo of a full-stack application comprising a **Node.js/Express backend**, a **React web panel**, and a **Flutter mobile app**. 

The defining aspect of this project is **not** just the final code, but **how it was delivered**. I developed and refactored this entire codebase without any prior syntax experience in Flutter (Dart) or React (TypeScript), working entirely as a human-in-the-loop orchestrator directing AI agents—a development style often referred to as **"Vibe Coding"**.

---

## 1. The AI-Orchestrator Paradigm

Instead of focusing on boilerplate syntax, my role was centered on **first-principles system engineering**:

- **System Architecture:** Designing how the Flutter client interacts with the Express REST API, how Prisma handles relations in PostgreSQL, and how user roles (students, teachers, admins) map across the database.
- **Agent Direction:** Translating logical flows into structured prompts for code agents. I directed the AI to generate complex UI components, handle state syncs, and wire up backend routes.
- **Safe Public Mocking:** Guided the AI to safely isolate production boundaries. We refactored external API routes (like Gemini Vision and Firebase Notifications) into clean, local mock/demo handlers so the app runs out-of-the-box without private credentials.

---

## 2. The Verification Loop (Human-in-the-Loop)

When you don't write the code yourself, **verification is everything**. I owned the runtime and set up a strict feedback loop to guarantee code quality:

- **Static Analysis & Compilers:** Used `flutter analyze` to catch Dart type errors, `npm run build` to verify React/TS bundling, and `node --check` to catch JavaScript syntax errors on the backend.
- **Interactive Debugging:** When the agent produced bugs, I parsed compilation stacks and runtime error logs, feeding the stack traces back to the agent with logical constraints to debug the issues systematically.
- **Database & State Control:** Managed database schema migrations using Prisma and verified local states to ensure data integrity during refactoring.

---

## 3. What This Demonstrates

This project showcases a modern, AI-native approach to software delivery:

1. **Stack Agnosticism:** The ability to target and deliver code on three completely different environments (Web, Mobile, Backend) simultaneously, regardless of prior familiarity.
2. **Speed & Pragmatism:** Delivering a complete full-stack experience in a fraction of the time by leveraging AI acceleration.
3. **Engineering Rigor:** A strong "verify first" mindset. AI generated the drafts, but the final integration succeeded because of strict build checks, static analysis, and structural validation.
