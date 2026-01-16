# Nazoratchi - Safety Oversight Portal

## Overview
This is a safety oversight web portal (Nazoratchi) with a NestJS backend and React frontend. The application provides industrial safety inspection management for organizations.

## Project Structure
- `/web` - React frontend (Vite-based)
- `/src` - NestJS backend
- `/src/api` - API controllers and modules
- `/src/core` - Core entities and services
- `/src/config` - Configuration files

## Frontend (React + Vite)
- Framework: React 18 with TypeScript
- Build tool: Vite
- UI library: Chakra UI
- State management: Zustand
- Routing: React Router DOM
- Port: 5000

## Backend (NestJS)
- Framework: NestJS
- Database: PostgreSQL (via TypeORM)
- Telegram Bot: nestjs-telegraf
- Logging: Winston
- Port: 3000

## Running the Application
The frontend runs on port 5000 with the command:
```
cd web && npm run dev
```

## Database
Uses PostgreSQL via Replit's built-in database service. Connection configured via environment variables.

## Environment Variables
- `DB_TYPE` - Database type (postgres)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_BAZE` - Database connection
- `BOT_TOKEN` - Telegram bot token
- `API_KEY` - API authentication key

## Recent Changes
- Migrated frontend from Create React App to Vite for better Replit compatibility
- Configured Vite to allow all hosts for Replit proxy
- Set up PostgreSQL database connection
