# FolaIgnite Frontend Architecture

> **Developer Guide to the Next.js Frontend Application**

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Page Routes](#page-routes)
4. [Authentication Flow](#authentication-flow)
5. [State Management](#state-management)
6. [API Services](#api-services)
7. [Components Library](#components-library)
8. [Styling System](#styling-system)
9. [Key Features](#key-features)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible components |
| **Zustand** | Lightweight state management |
| **React Query (TanStack)** | Server state & caching |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |

---

## Project Structure

```
ignite-frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group
│   │   ├── auth/login/
│   │   ├── auth/signup/
│   │   ├── auth/otp-verification/
│   │   └── auth/reset-password/
│   ├── home/                     # Public landing pages
│   │   ├── about/
│   │   ├── growth-partner/       # GP landing page
│   │   ├── become-mentor/
│   │   ├── become-partner/
│   │   ├── forum/
│   │   ├── resources/
│   │   ├── showcase/
│   │   └── impact/
│   ├── learner/                  # Student dashboard
│   │   ├── dashboard/
│   │   ├── resources/
│   │   ├── forum/
│   │   ├── messages/
│   │   └── submit-project/
│   ├── mentor/                   # Mentor dashboard
│   │   ├── profile/
│   │   ├── sessions/
│   │   └── messages/
│   ├── partner/                  # Organization dashboard
│   │   ├── dashboard/
│   │   ├── cohorts/
│   │   └── team/
│   ├── growth-partner/           # Growth Partner dashboard
│   │   ├── dashboard/
│   │   ├── referrals/
│   │   ├── earnings/
│   │   ├── transactions/
│   │   ├── withdrawals/
│   │   ├── settings/
│   │   └── onboard/
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── mentors/
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui primitives
│   ├── navigation.tsx
│   ├── footer.tsx
│   ├── growth-partner/           # Feature-specific components
│   └── shared/
├── lib/                          # Utilities & services
│   ├── services/                 # API service modules
│   │   ├── growth-partner.ts
│   │   └── ...
│   └── utils.ts
├── hooks/                        # Custom React hooks
├── store/                        # Zustand stores
│   └── authStore.ts
├── api/                          # React Query hooks
│   └── auth.ts
└── public/                       # Static assets
```

---

## Page Routes

### Public Routes (No Auth)

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page |
| `/home/about` | About | Platform info |
| `/home/growth-partner` | GP Landing | Growth Partner signup |
| `/home/become-mentor` | Mentor CTA | Mentor application info |
| `/home/become-partner` | Partner CTA | Organization signup |
| `/home/showcase` | Showcase | Approved projects |
| `/home/impact` | Impact | Platform metrics |
| `/home/forum` | Forum | Discussion threads |
| `/home/resources` | Resources | Learning materials |
| `/mentors` | Mentors | Browse mentors |
| `/auth/login` | Login | User login |
| `/auth/signup` | Signup | User registration |

### Protected Routes (Require Auth)

#### Learner Dashboard (`/learner/*`)

| Path | Description |
|------|-------------|
| `/learner/dashboard` | Main learner dashboard |
| `/learner/resources` | Personalized learning resources |
| `/learner/forum` | Discussion participation |
| `/learner/messages` | Mentor messaging |
| `/learner/submit-project` | Project submission |

#### Mentor Dashboard (`/mentor/*`)

| Path | Description |
|------|-------------|
| `/mentor/profile` | Profile management |
| `/mentor/sessions` | Session scheduling |
| `/mentor/messages` | Student messaging |

#### Partner/Organization Dashboard (`/partner/*`)

| Path | Description |
|------|-------------|
| `/partner/dashboard` | Organization overview |
| `/partner/cohorts` | Cohort management |
| `/partner/team` | Team member management |

#### Growth Partner Dashboard (`/growth-partner/*`)

| Path | Description |
|------|-------------|
| `/growth-partner/onboard` | Onboarding flow |
| `/growth-partner/dashboard` | Earnings overview |
| `/growth-partner/referrals` | Referral list |
| `/growth-partner/earnings` | Detailed earnings |
| `/growth-partner/transactions` | Commission history |
| `/growth-partner/withdrawals` | Withdrawal requests |
| `/growth-partner/settings` | Bank details & preferences |

#### Admin Panel (`/admin/*`)

| Path | Description |
|------|-------------|
| `/admin/dashboard` | Admin overview |
| `/admin/users` | User management |
| `/admin/mentors` | Mentor approvals |

---

## Authentication Flow

### 1. User Registration
```
Signup Page → POST /auth/register → OTP Sent → OTP Verification → Login
```

### 2. User Login
```
Login Page → POST /auth/login → OTP Required? → Yes: Verify OTP → No: Dashboard
```

### 3. Token Management
- **Access Token**: Stored in memory (Zustand store)
- **Refresh Token**: Stored in HTTP-only cookie
- **Refresh Flow**: Automatic via `/auth/refresh` on 401

### 4. Auth Store (Zustand)
```typescript
// store/authStore.ts
interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}
```

---

## State Management

### Global State (Zustand)

| Store | Purpose |
|-------|---------|
| `authStore` | User authentication state |

### Server State (React Query)

| Hook | Purpose |
|------|---------|
| `useAuth()` | Auth mutations (login, register, etc.) |
| `useStudentData()` | Student dashboard data |
| `useMentors()` | Mentor listings |

---

## API Services

All API calls are centralized in `/lib/services/`. Each service module exports functions for a specific feature domain.

### Example: Growth Partner Service
```typescript
// lib/services/growth-partner.ts

export async function checkEligibility() {
  return apiCall<{ eligible: boolean }>('/api/v1/growth-partner/verify-eligibility');
}

export async function registerAsGrowthPartner(acceptTerms: boolean) {
  return apiCall<{ success: boolean; partner: {...} }>('/api/v1/growth-partner/register', {
    method: 'POST',
    body: JSON.stringify({ acceptTerms }),
  });
}

export async function getDashboard() {
  return apiCall<GrowthPartnerDashboard>('/api/v1/growth-partner/dashboard');
}
```

### API Helper
```typescript
// lib/services/growth-partner.ts

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

---

## Components Library

### UI Primitives (shadcn/ui)
Located in `/components/ui/`:
- `Button`, `Card`, `Input`, `Label`
- `Dialog`, `Sheet`, `Tabs`
- `Select`, `Checkbox`, `Switch`
- `Table`, `Badge`, `Avatar`

### Custom Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Navigation` | `/components/navigation.tsx` | Global navbar |
| `Footer` | `/components/footer.tsx` | Global footer |
| `LoadingScreen` | `/components/shared/LoadingScreen.tsx` | Full-page loader |
| `ProgressCard` | `/components/learner/` | Activity progress |
| `GrowthPartnerSidebar` | `/components/growth-partner/sidebar.tsx` | GP navigation |

---

## Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        destructive: 'hsl(var(--destructive))',
      }
    }
  }
}
```

### CSS Variables (Dark Mode Ready)
```css
/* app/globals.css */
:root {
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  /* ... */
}

.dark {
  --background: 222 47% 11%;
  --foreground: 0 0% 100%;
  /* ... */
}
```

---

## Key Features

### 1. Referral Code Capture (Signup)
```typescript
// app/auth/signup/page.tsx
useEffect(() => {
  const urlRef = searchParams.get("ref");
  if (urlRef) {
    setReferralCode(urlRef.toUpperCase());
    document.cookie = `folaignite_ref=${urlRef}; path=/; max-age=${30*24*60*60}`;
  }
}, [searchParams]);
```

### 2. Protected Route Pattern
```typescript
// Example: Learner dashboard
"use client";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export default function LearnerDashboard() {
  const { currentUser } = useAuthStore();
  
  if (!currentUser) {
    redirect("/auth/login?redirect=/learner/dashboard");
  }
  
  if (currentUser.role !== "student") {
    redirect("/");
  }
  
  return <DashboardContent />;
}
```

### 3. Toast Notifications
```typescript
import { toast } from "sonner";

// Success
toast.success("Profile updated successfully!");

// Error
toast.error("Failed to save changes");

// Promise
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
});
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

*Last Updated: January 2026*
