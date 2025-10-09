# FolaIgnite - Learning Platform

A comprehensive learning platform designed to empower developers through daily 30-minute learning challenges.

## Features

### For Students
- **30-Day Challenge Tracker**: Monitor your daily learning progress with streak tracking
- **Activity Logging**: Document your daily learning activities and share with the community
- **Project Showcase**: Display your completed projects in a public gallery
- **Leaderboard**: See how you rank among your cohort peers
- **Community Feed**: Stay connected with fellow learners

### For Partners
- **Analytics Dashboard**: Track learner engagement and progress metrics
- **Cohort Management**: Manage multiple sponsored learning cohorts
- **Talent Access**: Connect with skilled developers completing challenges
- **Impact Reports**: View detailed statistics on your partnership impact
- **Brand Visibility**: Get recognition across the platform

### Public Pages
- **Landing Page**: Compelling hero section with subscription options
- **Project Showcase**: Filterable gallery of student projects
- **Impact Map**: Interactive visualization of global reach
- **Partner Benefits**: Detailed information for potential partners

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Icons**: Lucide React

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── about/page.tsx              # About page
│   ├── contact/page.tsx            # Contact page
│   ├── partners/page.tsx           # Partner benefits page
│   ├── showcase/page.tsx           # Project showcase gallery
│   ├── impact/page.tsx             # Impact map page
│   ├── student/dashboard/page.tsx  # Student dashboard
│   └── partner/dashboard/page.tsx  # Partner dashboard
├── components/
│   ├── navigation.tsx              # Main navigation with mobile menu
│   ├── footer.tsx                  # Site footer
│   ├── hero-section.tsx            # Landing page hero
│   ├── subscription-section.tsx    # Pricing/subscription cards
│   ├── progress-card.tsx           # 30-day progress tracker
│   ├── project-card.tsx            # Individual project card
│   ├── showcase-filters.tsx        # Project filtering controls
│   └── ... (other components)
└── public/
    └── ... (images and assets)
\`\`\`

## Key Features Implementation

### Interactive Components
- **Progress Tracking**: Real-time day completion with streak counting
- **Project Filtering**: Search and filter by track, country, and cohort
- **Like System**: Interactive project likes with state management
- **Impact Toggle**: Switch between student and partner views
- **Mobile Navigation**: Responsive hamburger menu with sheet overlay

### Design System
- **Colors**: Deep blue primary (#1e3a8a), soft orange accent (#fb923c)
- **Typography**: Geist Sans for UI, clean and modern
- **Spacing**: Consistent 8px grid system
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible grid layouts
- Touch-friendly interactive elements

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Run development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open browser**:
   Navigate to `http://localhost:3000`

## Pages Overview

- `/` - Landing page with hero and subscription options
- `/login` - User authentication
- `/signup` - New user registration
- `/about` - About FolaIgnite
- `/contact` - Contact form
- `/partners` - Partner benefits and inquiry form
- `/showcase` - Filterable project gallery
- `/impact` - Global impact visualization
- `/student/dashboard` - Student progress and activity tracking
- `/partner/dashboard` - Partner analytics and cohort management

## Future Enhancements

- Database integration for persistent data
- Real-time notifications
- Advanced analytics and reporting
- Social sharing features
- Mobile app (PWA)
- Multi-language support

## License

© 2025 FolaIgnite. All rights reserved.
