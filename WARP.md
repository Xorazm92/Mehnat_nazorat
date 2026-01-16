# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Nazoratchi** (NBT Aloqa Bot) is a comprehensive industrial safety oversight and labor compliance management system for NBT organization railway companies, built as a full-stack TypeScript application with three interfaces:
- **Backend API**: NestJS with TypeORM 
- **Telegram Bot**: Telegraf-based conversational interface with scene management
- **Web Portal**: React + Chakra UI dashboard
- **Mobile App**: Flutter application for field inspections

This is a trilingual codebase (English, Uzbek, Russian) with database, UI, and bot interactions primarily in Uzbek.

## Common Development Commands

### Backend Development
```bash
# Development with watch mode (most common)
npm run dev

# Standard development start
npm run start:dev

# Build for production
npm run build

# Production mode
npm run start:prod

# Format code
npm run format

# Lint and auto-fix
npm run lint
```

### Database & Seeding
```bash
# Seed advanced data (organizations, facilities, compliance items, inventory)
npm run seed:advanced

# Basic seed (departments only)
npm run seed

# Create admin user (edit src/create-admin.ts first with your Telegram ID)
npm run create-admin
```

### Testing
```bash
# Run unit tests
npm run test

# Watch mode for tests
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

Note: Test files do not currently exist in this codebase. When creating tests, follow Jest conventions with `.spec.ts` files in `src/` matching the structure of the code being tested.

### Web Portal
```bash
cd web

# Install dependencies
npm install

# Development server (runs on port 5000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile App
```bash
cd mobile

# Install dependencies
flutter pub get

# Run on connected device/emulator
flutter run

# Build for Android
flutter build apk

# Build for iOS
flutter build ios
```

## Architecture Overview

### Three-Layer Architecture

The backend follows a clean three-layer architecture:

1. **API Layer** (`src/api/`): Controllers, DTOs, bot updates, and HTTP interfaces
2. **Core Layer** (`src/core/`): Business logic services, entities (TypeORM), and repositories
3. **Common Layer** (`src/common/`): Shared utilities, guards, enums, types, constants

### Key Architectural Patterns

#### Module Organization
- **CoreModule**: Exports all business logic services (TaskService, OrganizationService, PlanService, etc.) and TypeORM entities
- **BotModule**: Telegraf integration with scene-based conversational flows
- **AdminModule**, **UserModule**: Role-based bot functionality separation
- **SchedulerModule**: Cron jobs for automated notifications and plan generation

#### Database Strategy
- Supports both SQLite (development) and PostgreSQL (production)
- TypeORM with entity-based modeling
- `synchronize: true` for SQLite, `false` for PostgreSQL (use migrations in production)
- Database selection via `DB_TYPE` environment variable

#### Bot Architecture (Telegraf Scenes)
The Telegram bot uses a scene-based architecture for multi-step conversational flows:
- Scenes are located in `src/api/bot/*/scenes/` directories
- Each scene handles a specific workflow (e.g., CreateTaskScene, CreateReportScene)
- Updates (handlers) are in `*.update.ts` files, organized by feature domain
- Button builders in `src/api/bot/buttons/` provide reusable keyboard layouts
- Admin functionality is separated into `src/api/bot/admin/`

#### State Management
- **Bot**: Session-based state via Telegraf middleware
- **Web**: Zustand for global state (auth, data stores)
- **Mobile**: Provider pattern for state management

### Core Domain Entities

The system models a comprehensive industrial safety compliance workflow:

**Organization Structure**:
- `Organization` (e.g., Qo'qon MTU, Temiryo'l Kargo) → `Facility` (work sites) → `ResponsibilityMatrix` (assigned personnel)

**Planning & Compliance**:
- `AnnualPlan` → `MonthlyPlan` → `PlanItem` (specific tasks mapped to regulatory articles)
- `ComplianceItem` (8 regulatory articles from industrial safety code) ↔ `ComplianceCheck` (verification records)

**Task Management**:
- `Task` (assigned work) ↔ `Report` (work completion documentation)
- `Statistics` (performance metrics per user/period)
- `Salary` (compensation calculations based on task completion)

**Inventory & Equipment**:
- `InventoryItem` (safety equipment catalog) ↔ `IssuanceLog` (issue/return/damage tracking)

**Campaigns & Communications**:
- `Campaign` (safety campaigns like "Winter Preparation") → `CampaignAction` (action items)
- `Message` (broadcast messages)
- `Appeals` (user requests/complaints)

**User Management**:
- `User` (with `role`: MANAGER, INSPECTOR, COORDINATOR, or MEMBER)
- `Department` (organizational units)

### Configuration & Environment

Configuration is centralized in `src/config/index.ts`:
- Uses `@nestjs/config` with Joi validation schema
- Required variables: `BOT_TOKEN`, `API_KEY`, `DB_BAZE`
- Database configuration auto-switches between SQLite/PostgreSQL
- See `.env.example` for template

Critical environment variables:
```
PORT=3000
BOT_TOKEN=<telegram_bot_token_from_botfather>
API_KEY=<min_16_chars_for_api_protection>
DB_TYPE=sqlite|postgres
DB_HOST=localhost (postgres only)
DB_PORT=5432 (postgres only)
DB_USER=postgres (postgres only)
DB_PASSWORD=password (postgres only)
DB_BAZE=nbt_aloqa.sqlite (or postgres db name)
ADMIN_ID=<optional_telegram_id>
```

### API Structure

RESTful endpoints are in `src/api/`:
- `organization.controller.ts`: Organization and facility CRUD
- `plan.controller.ts`: Annual/monthly plan management and approval
- `compliance.controller.ts`: Compliance items and checks
- `inventory.controller.ts`: Equipment issue/return/damage operations

All API routes are protected by `ApiKeyGuard` (set `x-api-key` header).

### Logging

Winston-based logging configured in `src/main.ts`:
- Console output with timestamps and colors
- Error log: `logs/error.log`
- Combined log: `logs/combined.log`
- PM2 logs (production): `logs/pm2-error.log`, `logs/pm2-out.log`

## Development Workflow

### Starting Development

1. Install all dependencies:
```bash
npm install
cd web && npm install && cd ..
cd mobile && flutter pub get && cd ..
```

2. Configure `.env` file (copy from `.env.example`)

3. Start backend in watch mode:
```bash
npm run dev
```

4. Seed initial data (first time only):
```bash
npm run seed:advanced
```

5. Create admin user (edit `src/create-admin.ts` with your Telegram ID first):
```bash
npm run create-admin
```

6. Start web portal (separate terminal):
```bash
cd web && npm run dev
```

### Path Aliases

TypeScript path aliases configured in `tsconfig.json`:
```typescript
import { User } from 'src/core/entity/user.entity';
import { UserRole } from 'src/common/enum';
```

Always use `src/*` imports, not relative paths like `../../`.

### Adding New Features

**New Entity**:
1. Create entity file in `src/core/entity/`
2. Add to `CoreModule` imports and exports
3. Create corresponding service in `src/core/services/`
4. Add TypeOrmModule.forFeature([NewEntity]) to CoreModule
5. Export service from CoreModule

**New API Endpoint**:
1. Create controller in `src/api/` or add to existing controller
2. Create DTOs in `src/api/dto/` for request/response validation
3. Add controller to AppModule controllers array
4. Use injected core services for business logic

**New Bot Scene**:
1. Create scene class in `src/api/bot/[feature]/scenes/`
2. Extend Telegraf's `Scenes.WizardScene` or `Scenes.BaseScene`
3. Register scene in `BotModule` providers
4. Add scene triggers in corresponding `*.update.ts` file

**New Scheduled Task**:
1. Add method with `@Cron()` decorator in `src/api/bot/scheduler/scheduler.service.ts`
2. Use cron syntax (e.g., `'0 17 * * *'` for 5 PM daily)

### Code Style

- **Language**: TypeScript (strict mode disabled for this codebase)
- **Formatting**: Prettier configured (`.prettierrc`)
- **Linting**: ESLint with TypeScript plugin (`.eslintrc.js`)
- **Naming**: 
  - Files: kebab-case (e.g., `user.entity.ts`, `task.service.ts`)
  - Classes: PascalCase (e.g., `TaskService`, `CreateTaskScene`)
  - Variables/functions: camelCase
- **User-facing text**: Uzbek language for bot messages and UI
- **Code comments**: English or Uzbek

### Database Changes

**Development (SQLite)**:
- Set `synchronize: true` in AppModule (already configured)
- Entity changes auto-sync on app restart
- Database file: `nbt_aloqa.sqlite` in project root

**Production (PostgreSQL)**:
- Set `synchronize: false` 
- Generate migrations: TypeORM CLI or manual SQL
- Run migrations before deployment
- Never use auto-sync in production

## Important Caveats

### Multi-Interface Coordination
Changes to data models require updates across three codebases:
1. Backend entity + service
2. Web portal API client + UI components  
3. Mobile app models + screens

Always verify changes work across all interfaces.

### Telegram Bot Token Security
- Never commit `BOT_TOKEN` to version control
- Bot tokens are in `.env` file (git-ignored)
- BotFather tokens are production-sensitive
- Use separate bots for dev/staging/production

### Database Type Switching
When switching between SQLite and PostgreSQL:
1. Update `DB_TYPE` in `.env`
2. Provide all required DB credentials for PostgreSQL
3. Re-run seed scripts for new database
4. SQLite file is ignored by git, PostgreSQL dumps should be in `.gitignore`

### Role-Based Access
- Bot commands check user role via `User.role` field
- Admin commands require `role: 'MANAGER'`
- API endpoints protected by `ApiKeyGuard` globally
- Implement granular RBAC in controllers as needed

### Scheduled Tasks
Cron jobs run in-process (NestJS Schedule):
- Monthly plan generation: Last day of month at 5 PM
- Overdue notifications: Daily at 9 AM
- Safety day reminders: Mondays at 8 AM
- Winter prep campaign: September 1st at 8 AM

Do not schedule resource-intensive jobs here; offload to queue (not yet implemented).

### Translation & Localization
Bot messages and UI text are in Uzbek (Latin script). When modifying strings:
- Keep consistent terminology (e.g., "vazifa" = task, "hisobot" = report)
- Button texts defined in `src/api/bot/buttons/`
- Admin messages in `src/common/constants/admin/`

## Production Deployment

See `DEPLOY.md` for comprehensive production deployment guide.

Quick production checklist:
1. Set `DB_TYPE=postgres` and configure PostgreSQL
2. Set strong `API_KEY` (minimum 16 characters)
3. Use PM2 for process management (`pm2 start ecosystem.config.js`)
4. Enable PM2 startup script for auto-restart
5. Never use `synchronize: true` with PostgreSQL in production
6. Set up reverse proxy (nginx) for web portal if needed
7. Monitor logs in `logs/` directory

For cloud platforms (Render, Railway, Heroku):
- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Configure all environment variables in platform dashboard

## Documentation

Additional documentation files in this repository:
- `README.md`: General NestJS template readme
- `QUICK_START.md`: 3-minute fast start guide
- `STARTUP_GUIDE.md`: Comprehensive startup walkthrough
- `IMPLEMENTATION_PLAN.md`: Feature implementation roadmap (task/report system)
- `ADMIN_GUIDE.md`: Telegram bot admin features guide (in Uzbek)
- `BUILD_FIX_SUMMARY.md`: Historical build fixes reference
- `DEPLOY.md`: Production deployment instructions

Refer to these for detailed feature explanations and setup instructions.
