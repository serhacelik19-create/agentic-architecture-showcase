# Kortex Public Demo

This is a sanitized public demo copy of the Kortex/YKS project.

## Included

- `backend/`: Node.js/Express backend structure with Prisma routes and demo-mode AI services.
- `panel/`: React/Vite institution panel.
- `admin/`: React/Vite admin panel.
- `yks/`: Flutter student app.

## Sanitization

- No `.env` files are included.
- No production API URL is included.
- No API keys, database passwords, Firebase service accounts, build outputs, logs, or dependency folders are included.
- AI and push notification services are disabled/mocked in demo mode.
- Frontend API clients point to local development endpoints only.
- Google Fonts are kept for visual fidelity.

## Local Endpoints

- Backend: `http://127.0.0.1:8080`
- API base: `http://127.0.0.1:8080/api`
- Panel dev server: `http://127.0.0.1:5173`

## Notes

This repository is intended for portfolio/code review purposes. It shows architecture, UI structure, and application flow without exposing private project data or production infrastructure.
