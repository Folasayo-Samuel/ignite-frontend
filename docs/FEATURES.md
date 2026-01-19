# FolaIgnite Frontend Features

> **User-Facing Features and Pages Guide**

---

## Feature Categories

### 1. Public Landing Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Main landing page with hero, features, CTAs |
| About | `/home/about` | Platform story and mission |
| Impact | `/home/impact` | Live platform metrics and milestones |
| Showcase | `/home/showcase` | Approved student projects |
| Forum | `/home/forum` | Public discussion threads |
| Resources | `/home/resources` | Curated learning materials |
| Mentors | `/mentors` | Browse all mentors |
| Become Mentor | `/home/become-mentor` | Mentor application info |
| Become Partner | `/home/become-partner` | Organization signup info |
| Growth Partner | `/home/growth-partner` | Referral program info |

---

### 2. Authentication Pages

| Page | Path | Purpose |
|------|------|---------|
| Login | `/auth/login` | Email/password login |
| Signup | `/auth/signup` | New user registration |
| OTP Verification | `/auth/otp-verification` | Email verification |
| Forgot Password | `/auth/forgot-password` | Password reset request |
| Reset Password | `/auth/reset-password` | Password reset form |

**Key Feature**: Captures `?ref=CODE` for referral tracking on signup.

---

### 3. Learner Dashboard

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/learner/dashboard` | Main learner home |
| Resources | `/learner/resources` | Personalized learning content |
| Forum | `/learner/forum` | Discussion participation |
| Messages | `/learner/messages` | Mentor communication |
| Submit Project | `/learner/submit-project` | Portfolio submission |

**Dashboard Components**:
- Progress card (streak, activities)
- Cohort information
- Mentor messaging shortcut
- Subscription status

---

### 4. Mentor Dashboard

| Page | Path | Purpose |
|------|------|---------|
| Profile | `/mentor/profile` | Manage mentor profile |
| Sessions | `/mentor/sessions` | View scheduled sessions |
| Messages | `/mentor/messages` | Student communication |

---

### 5. Partner (Organization) Dashboard

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/partner/dashboard` | Organization overview |
| Cohorts | `/partner/cohorts` | Manage learning cohorts |
| Team | `/partner/team` | Team member management |

**Features**:
- Verified partner badge
- Subscription tier display
- Seat usage metrics

---

### 6. Growth Partner Dashboard

| Page | Path | Purpose |
|------|------|---------|
| Onboarding | `/growth-partner/onboard` | Registration flow |
| Dashboard | `/growth-partner/dashboard` | Earnings overview |
| Referrals | `/growth-partner/referrals` | Track referred users |
| Earnings | `/growth-partner/earnings` | Detailed earnings |
| Transactions | `/growth-partner/transactions` | Commission history |
| Withdrawals | `/growth-partner/withdrawals` | Payout requests |
| Settings | `/growth-partner/settings` | Bank details |

**Sidebar Navigation**: Persistent across all GP pages.

---

### 7. Admin Panel

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/admin/dashboard` | Platform overview |
| Users | `/admin/users` | User management |
| Mentors | `/admin/mentors` | Mentor approvals |

---

## Shared Components

### Navigation

**File**: `components/navigation.tsx`

**Behavior**:
- Shows different links based on auth state
- Role-based menu items (learner vs mentor)
- Mobile-responsive hamburger menu

### Footer

**File**: `components/footer.tsx`

**Sections**:
- Platform links
- Resources
- Company
- Social media

### Loading States

**File**: `components/shared/LoadingScreen.tsx`

- Full-page spinner
- Skeleton loaders for cards

---

## Key UI Patterns

### Toast Notifications
```typescript
import { toast } from "sonner";

toast.success("Action completed!");
toast.error("Something went wrong");
```

### Form Handling
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Data Fetching
```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["dashboard"],
  queryFn: getDashboard,
});
```

---

## Responsive Design

**Breakpoints** (Tailwind):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile-First**: All layouts start mobile, scale up.

---

*Last Updated: January 2026*
