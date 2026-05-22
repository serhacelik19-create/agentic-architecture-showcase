# ChefVision AI - Smart Recipe Advisor

ChefVision AI is a smart recipe advisor and ingredient recognition system powered by advanced AI and computer vision. It allows users to scan kitchen ingredients using their camera, receive personalized recipe recommendations, and interact with an integrated voice assistant for hands-free cooking guidance.

This repository is a sanitized public demo of the project, showcasing frontend layout, backend APIs, data structures, and mobile app flows for portfolio review, while keeping private API keys and database credentials safe.

## What The Project Shows

- **AI-Powered Ingredient Scanning**: Mobile client camera workflow that detects raw ingredients using Gemini AI.
- **Voice-Assisted Cooking**: Hands-free instruction reading and interactive speech commands during food preparation.
- **Robust Caching & Queueing**: Python (FastAPI) backend using Redis for response caching and fast lookup.
- **Admin Dashboard**: Next.js (App Router) web dashboard for admin oversight, user monitoring, and recipe curation.

## Repository Structure

Inside this folder, you will find:
- **`lib/`**, **`android/`**, **`ios/`**: The core Flutter mobile application code.
- **`backend/`**: Python FastAPI backend supporting authentication, recipe pipelines, database ORM, and Gemini API connectors.
- **`dashboard/`**: Next.js admin dashboard application.

## Tech Stack

- **Mobile Client**: Flutter, Dart, Camera API, local storage, Speech-to-Text & Text-to-Speech integration.
- **Backend API**: Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Firebase Admin SDK.
- **Admin Dashboard**: Next.js, React, TailwindCSS, TypeScript.

## Demo & Security Safeguards

- No `.env` files are included.
- No live database passwords, Gemini AI API keys, or Firebase keys are committed.
- Speech engines and Gemini client endpoints are configured with developer placeholders.
- Database runs locally using standard configurations.

## Setup Instructions

### Flutter Mobile App
Run the following at the root of `chefvision`:
```bash
flutter pub get
```

### Python Backend
Navigate to the backend folder, configure your virtual environment, and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Next.js Dashboard
Navigate to the dashboard folder and install packages:
```bash
cd dashboard
npm install
```
