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
#### Hybrid Resources Page (`/home/resources`)
Uses a smart hybrid strategy to serve two audiences:
1.  **Public Visitors ("Teaser Mode")**: See a static, curated list of resources (Product, Design, Eng) defined in `data/teaser-resources.ts`.
2.  **Logged-In Learners ("Pro Mode")**: Automatically switches to fetch live, personalized data from the backend (`/students/resources/search`) via `useApiQuery`.

## 4. Setup & Commands

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
