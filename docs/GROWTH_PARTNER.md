# Growth Partner Frontend Implementation

## Overview
The Growth Partner module provides a dedicated dashboard for partners to manage their referrals, track earnings, and request withdrawals.

## Key Screens

### 1. Landing Page (`/home/growth-partner`)
- Marketing page for prospective partners.
- High-intent CTAs redirect to onboard/register.

### 2. Onboarding (`/growth-partner/onboard`)
- Stepper-based registration process.
- Integrated with `AuthStore` to check eligibility.

### 3. Dashboard (`/growth-partner/dashboard`)
- Primary overview of metrics (Referrals, Subscribers, Earnings).
- Regional distribution map/stats (Nigeria vs International).
- Recent activity feed.

### 4. Referrals List (`/growth-partner/referrals`)
- Tabular view of all referred users.
- **Search Integration**: Linked to the global dashboard header. Supports real-time filtering via URL query parameters (`?search=...`).
- Pagination support.

### 5. Financial Management
- **Earnings** (`/growth-partner/earnings`): Monthly breakdown and transaction history.
- **Withdrawals** (`/growth-partner/withdrawals`): Request form and status tracking.
- **Settings** (`/growth-partner/settings`): Secure bank detail configuration (Encrypted on backend).

## Technical Implementation

### API Service (`lib/services/growth-partner.ts`)
The central API client for all partner operations. 

```typescript
import { growthPartnerApi } from "@/lib/services/growth-partner";

// Example: Fetching dashboard data
const dashboard = await growthPartnerApi.getDashboard();
```

### Referral Tracking Logic
Referral codes are captured from the URL and persisted in a cookie (`folaignite_ref`) for 30 days.

```typescript
// referral-tracking.ts (Simplified)
const ref = searchParams.get("ref");
if (ref) {
  saveReferralCode(ref); // Stores in cookie
}
```

### Search Implementation
The search bar in `GrowthPartnerHeader` performs a client-side redirect to the referrals page.

```typescript
// header.tsx
router.push(`/growth-partner/referrals?search=${query}`);
```

The `ReferralsPage` then consumes this param using `useSearchParams` and triggers a filtered data fetch.

## Design System
- **Colors**: Primary Blue (`#3B82F6`) for actions, with success/warning states for financial status.
- **Icons**: Lucide React for consistent navigation and status indication.
- **Responsiveness**: Fully responsive 12-column grid layout for complex data views.

---
*Last Updated: January 2026*
