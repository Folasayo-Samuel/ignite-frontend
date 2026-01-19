# FolaIgnite Frontend Documentation

## 1. Overview
The FolaIgnite Frontend is a modern, responsive web application built with **Next.js 15 (App Router)**. It provides a premium user experience with server-side rendering, dynamic client-side interactivity, and a robust design system.

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 with Shadcn UI components
- **State Management**: Zustand (Global Auth/UI state) + TanStack Query (Server state)
- **Data Fetching**: Axios (Custom Instance)

## 2. Architecture

### Folder Structure
- **`app/`**: Next.js App Router pages and layouts.
- **`components/`**: Reusable UI components (buttons, inputs, cards). Includes Shadcn base components.
- **`api/`**: API definitions. Each file corresponds to a backend module (e.g., `auth.ts`, `cohorts.ts`).
- **`hooks/`**: Custom React hooks.
    - `axiosInstance.ts`: Core HTTP client with interceptors.
    - `useApiQuery`/`useApiMutation`: Wrappers for React Query.
- **`store/`**: Global state definitions using Zustand (e.g., `authStore`).
- **`schemas/`**: Zod schemas for form validation.

### API Integration
The application uses a layered approach for API communication:
1.  **Axios Instance** (`hooks/axiosInstance.ts`):
    - Configured with `baseURL` and credentials.
    - **Interceptors**: Automatically attaches tokens, handles 401 refreshes (Logout on fail), and logs errors in dev.
2.  **API Function Definitions** (`api/*.ts`):
    - Specific functions for each endpoint (e.g., `login user`, `fetch cohorts`).
    - strictly typed request/response generic types.
3.  **React Query**:
    - Components consume API data via `useQuery` or `useMutation` hooks, ensuring caching, loading states, and automatic background refetching.

## 3. Key Concepts & Patterns

### Authentication
- **Store**: `useAuthStore` manages the user's logged-in state and profile data.
- **Flow**:
    - Login -> API returns Tokens (HTTP-only cookies recommended for Refresh).
    - `axiosInstance` handles token attachment.
    - On 401 error -> Interceptor attempts Refresh -> If fail, Logout & Redirect.

### Forms & Validation
- **Engine**: `react-hook-form` is used for all forms.
- **Validation**: `zod` schemas define validation rules, ensuring type safety from form to API.

### Styling & Design System
- **TailwindCSS**: Utility-first styling.
- **Shadcn UI**: Accessible, headless components styled with Tailwind.
- **Icons**: `lucide-react` for consistent iconography.

### Terminology ("Learner" vs "Student")
- **UI Rebranding**: The public-facing interface uses the term **"Learner"** (e.g., "Join as Learner", "Learner Dashboard") to appear more inclusive to professionals.
- **Codebase Convention**: The internal codebase (variable names, types, API endpoints) retains the **"Student"** terminology (e.g., `useStudents`, `/api/students`, `StudentProfile`).
- **Developer Note**: When working on UI, use "Learner". When working on logic, expect "Student".

### Feature Spotlights
#### Public Analytics & Impact
To ensure transparency and "Data Honesty", marquee hero sections and statistics cards (`PartnerStats`, `ImpactStatsGrid`) consume live data from the `/analytics/impact` endpoint. Hardcoded placeholders like "5,000+" have been removed in favor of these dynamic, reactive metrics.

#### Unified Role Funnels (`/home/become-mentor`, `/home/become-partner`)
To reduce friction and increase conversion, high-intent roles (Mentors, Partners) follow a "seamless" landing pattern:
1.  **Guest View**: Users see value propositions and a primary "Sign up" CTA.
2.  **Auth Integration**: The CTA redirects to a pre-configured signup link (`/auth/signup?role=...`).
3.  **App View**: Authenticated users see the real application/inquiry form, which pre-fills their basic info and saves their organizational data directly.

## 4. Feature Documentation
Detailed technical documentation for major product modules can be found in their respective files:

- **[Growth Partner Program](file:///Users/folasayoolayemi/Desktop/FolaIgnite/ignite-frontend/docs/GROWTH_PARTNER.md)**: Implementation details for the partner dashboard, referral tracking, and financial management.

## 5. Advanced UI Patterns

### Responsive Layout System
The dashboard uses a **12-column asymmetric grid** (`lg:grid-cols-12`) to manage complex information density:
- **Main Column (`lg:col-span-8`)**: Houses primary interactive cards (Progress, Activity, Feed).
- **Sidebar Column (`lg:col-span-4`)**: Contains secondary information (Achievements, Leaderboard).
- **Breakpoint Behavior**: On mobile/tablet, columns stack vertically (`grid-cols-1`) with specific spacing adjustments to prevent cramping.

### Resilient Payment Polling
Post-payment verification (e.g., in `StudentDashboardHeader`) uses a robust polling pattern:
1.  **Strict Timeouts**: Polling is capped at a maximum number of attempts (e.g., 10 attempts over 20 seconds).
2.  **Safety Wrappers**: `try-catch` blocks prevent API failures from crashing the hook.
3.  **Cleanup**: Mandatory cleanup on unmount or success ensures no memory leaks or stale toast notifications remain visible.

### Layout Break Prevention
- **Text Truncation**: Use `truncate` or `break-all` on dynamic IDs/Prices to prevent container expansion.
- **Flex Wrapping**: List-item headers (e.g., in `ResourceLibraryCard`) use `flex-col sm:flex-row` and `flex-wrap` to handle long titles alongside badges on narrow screens.

## 5. Setup & Commands

### Prerequisites
- Node.js (v18+)

### Installation
```bash
# Install dependencies
npm install

# Setup Environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL pointing to backend
```

### Development
```bash
npm run dev
# Server runs on localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

## 5. Developer Guide

### Adding a New Feature
1.  **Backend API**: Ensure endpoint exists. Add definition to `api/[feature].ts`.
2.  **Schema**: Create Zod schema in `schemas/` if it involves a form.
3.  **Component**: Build the UI component in `components/`. Use Shadcn primitives.
4.  **Hook up**: Use `useQuery` (read) or `useMutation` (write) to connect UI to API function.
5.  **Page**: Add the Route in `app/`.

### Best Practices
- **Server vs Client Components**: Use Client Components (`"use client"`) only when interactivity (hooks) is needed. Favor Server Components for initial layout/data fetching where possible.
- **Strict Typing**: Avoid `any`. Define interfaces for all API responses.
