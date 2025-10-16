# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a club dashboard application for Alpha Kappa Psi (AKPsi) Omega Phi Chapter - a credit tracking and event management system. The app tracks member attendance at various events categorized by brotherhood, education, service, fundraising, rush, and professional credits.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Build Tool**: Turbopack (via `--turbopack` flag)

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Database Management

### Drizzle ORM Commands

The database schema is defined in `src/db/schema.ts` and migrations are stored in `./migrations`.

**Note**: Drizzle commands must be run with `npx` since they're not in package.json scripts:

```bash
# Generate migrations after schema changes
npx drizzle-kit generate

# Push schema changes directly to database (skip migrations)
npx drizzle-kit push

# Open Drizzle Studio to browse database
npx drizzle-kit studio
```

Configuration is in `drizzle.config.ts` - uses Neon serverless PostgreSQL.

### Database Schema

Three main tables:
- **users**: `id`, `name`
- **events**: `id`, `eventName`, `category`, `order` (for drag-and-drop sorting)
- **attendances**: `id`, `userId`, `eventId`, `attended` (join table)

Event categories: `brotherhood`, `education`, `service`, `fundraising`, `rush`, `procredits`

## Architecture

### Database Layer (`src/db/`)
- `drizzle.ts`: Database client initialization (Neon HTTP)
- `schema.ts`: Drizzle schema definitions

### API Routes (`src/app/api/`)

RESTful API structure using Next.js 15 route handlers (async params):

**Users:**
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/[userId]` - Get user (placeholder)
- `DELETE /api/users/[userId]` - Delete user (placeholder)

**Events:**
- `GET /api/events` - List all events
- `POST /api/events` - Create event (auto-assigns order within category)
- `DELETE /api/events/[eventId]` - Delete event and associated attendances
- `PATCH /api/events/[eventId]` - Update event order (for drag-and-drop)

**Important**: Next.js 15 requires `await params` in dynamic routes:
```typescript
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params; // Must await!
    // ...
}
```

### Frontend Structure

**Layout** (`src/app/layout.tsx`):
- Uses SidebarProvider with collapsible AppSidebar
- Geist font family (sans + mono)

**Main Page** (`src/app/page.tsx`):
- Dashboard with stats cards (balance, marketing, active members)
- Three-column chart layout (UpcomingEvents, BarChart, RadialChart)
- Uses container queries for responsive cards (`@container/card`)

**Sidebar** (`src/components/AppSideBar.tsx`):
- Team switcher with chapter branding
- Hierarchical navigation (Dashboard, Directors)
- User profile dropdown
- Currently uses mock data

**Components** (`src/components/`):
- Custom components: `UpcomingEvents`, `BarChart`, `radialChart`
- UI primitives in `ui/`: shadcn/ui components (card, button, dialog, etc.)

### Drag-and-Drop Implementation

The app uses `@dnd-kit` libraries for sortable events within categories. The `order` field in events table maintains position.

## Environment Variables

Requires `DATABASE_URL` environment variable for Neon PostgreSQL connection. No `.env.example` exists - create one if needed.

## Development Notes

- The app currently uses significant mock/placeholder data (UpcomingEvents, dashboard stats)
- Some API routes in `[userId]` are stubs
- Event categories are hardcoded strings - consider enum or constants
- Next.js 15 breaking change: Dynamic route params must be awaited
