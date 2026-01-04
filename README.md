# FolaIgnite - Learning Platform

A comprehensive learning platform designed to empower builders through daily 30-minute learning challenges.

## Features

### For Students
- **30-Day Challenge Tracker**: Monitor your daily learning progress with streak tracking and day completion
- **Activity Logging**: Document your daily learning activities and share with the community
- **Project Showcase**: Display your completed projects in a public gallery with likes and comments
- **Leaderboard**: See how you rank among your cohort peers
- **Community Feed**: Stay connected with fellow learners, like and comment on posts
- **Achievements System**: Unlock badges and track milestones throughout your journey
- **Day 30 Celebration**: Receive a shareable badge upon completing the 30-day challenge
- **Resource Library**: Access curated learning materials filtered by category and skill level
- **Mentor Matching**: Connect with experienced developers for personalized guidance
- **Discussion Forum**: Ask questions, share knowledge, and help peers
- **Event Calendar**: Register for workshops, webinars, and community sessions
- **User Profile**: Manage your public profile with bio, skills, and social links
- **Real-time Notifications**: Stay updated on achievements, comments, and cohort activities

### For Partners
- **Analytics Dashboard**: Track learner engagement and progress metrics
- **Cohort Management**: Create and manage multiple sponsored learning cohorts
- **Talent Access**: Connect with skilled developers completing challenges
- **Impact Reports**: View detailed statistics on your partnership impact
- **Brand Visibility**: Get recognition across the platform
- **Export Analytics**: Download reports in CSV, PDF, or JSON formats

### For Admins
- **User Management**: Manage students, partners, and their permissions
- **Project Moderation**: Review and approve submitted projects
- **Cohort Overview**: Monitor all active, completed, and upcoming cohorts
- **Platform Analytics**: View comprehensive statistics and engagement metrics
- **Export Reports**: Generate detailed reports for various time ranges
- **Content Management**: Oversee all platform content and activities

### Public Pages
- **Landing Page**: Compelling hero section with subscription options and live statistics
- **Project Showcase**: Filterable gallery of student projects with search functionality
- **Impact Map**: Interactive visualization of global reach with country breakdowns
- **Partner Benefits**: Detailed information for potential partners with inquiry form
- **About Page**: Learn about FolaIgnite's mission and vision
- **Contact Page**: Get in touch with the team

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Icons**: Lucide React

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                    # Landing page with stats
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── about/page.tsx              # About page
│   ├── contact/page.tsx            # Contact page
│   ├── profile/page.tsx            # User profile page
│   ├── partners/page.tsx           # Partner benefits page
│   ├── showcase/page.tsx           # Project showcase gallery
│   ├── impact/page.tsx             # Impact map page
│   ├── resources/page.tsx          # Resource library
│   ├── achievements/page.tsx       # Achievements page
│   ├── forum/page.tsx              # Discussion forum
│   ├── mentors/page.tsx            # Mentor matching
│   ├── events/page.tsx             # Events calendar
│   ├── student/dashboard/page.tsx  # Student dashboard
│   ├── partner/dashboard/page.tsx  # Partner dashboard
│   ├── admin/dashboard/page.tsx    # Admin dashboard
│   └── not-found.tsx               # 404 page
├── components/
│   ├── navigation.tsx              # Main navigation with search and notifications
│   ├── footer.tsx                  # Site footer with all links
│   ├── search-bar.tsx              # Global search functionality
│   ├── notifications-panel.tsx     # Real-time notifications dropdown
│   ├── celebration-modal.tsx       # Day 30 completion celebration
│   ├── comment-dialog.tsx          # Comment system for posts
│   ├── achievements-card.tsx       # Achievement tracking
│   ├── resource-library-card.tsx   # Learning resources
│   ├── mentor-matching-card.tsx    # Mentor profiles
│   ├── discussion-forum-card.tsx   # Forum discussions
│   ├── calendar-schedule-card.tsx  # Event scheduling
│   ├── user-profile-card.tsx       # User profile management
│   ├── admin-analytics-export.tsx  # Export functionality
│   ├── hero-section.tsx            # Landing page hero
│   ├── subscription-section.tsx    # Pricing/subscription cards
│   ├── progress-card.tsx           # 30-day progress tracker
│   ├── project-card.tsx            # Individual project card with likes
│   ├── showcase-filters.tsx        # Project filtering controls
│   └── ... (50+ other components)
└── public/
    └── ... (images and assets)
\`\`\`

## Key Features Implementation

### Interactive Components
- **Progress Tracking**: Real-time day completion with streak counting and celebration modal
- **Project Filtering**: Search and filter by track, country, and cohort
- **Like & Comment System**: Interactive engagement with state management
- **Impact Toggle**: Switch between student and partner views with dynamic data
- **Mobile Navigation**: Responsive hamburger menu with sheet overlay
- **Global Search**: Search across pages, resources, mentors, and events
- **Notifications**: Real-time updates with mark as read and delete functionality
- **Cohort Creation**: Functional dialogs for partners and admins to create cohorts
- **Profile Editing**: In-place editing with save/cancel functionality
- **Event Registration**: Register for workshops and community events

### Design System
- **Colors**: Deep blue primary (#1e3a8a), soft orange accent (#fb923c), white background
- **Typography**: Geist Sans for UI, clean and modern with proper hierarchy
- **Spacing**: Consistent 8px grid system with Tailwind spacing scale
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, proper contrast ratios
- **Smooth Scrolling**: Enhanced UX with smooth anchor link navigation

### Responsive Design
- Mobile-first approach with touch-friendly interactions
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts with CSS Grid and Flexbox
- Responsive navigation with mobile menu
- Optimized images and assets

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

### Public Pages
- `/` - Landing page with hero, stats, and subscription options
- `/login` - User authentication
- `/signup` - New user registration
- `/about` - About FolaIgnite
- `/contact` - Contact form
- `/partners` - Partner benefits and inquiry form
- `/showcase` - Filterable project gallery with search
- `/impact` - Global impact visualization with toggle views
- `/resources` - Curated learning resource library
- `/achievements` - Achievement badges and progress
- `/forum` - Community discussion forum
- `/mentors` - Mentor matching and profiles
- `/events` - Upcoming workshops and events calendar

### Authenticated Pages
- `/profile` - User profile management with stats
- `/student/dashboard` - Student progress, activity logging, and community feed
- `/partner/dashboard` - Partner analytics and cohort management
- `/admin/dashboard` - Admin panel with user management and analytics export

## Component Highlights

### Student Dashboard
- 30-day progress tracker with clickable days
- Activity logging form with topic and description
- Real-time cohort feed with like and comment functionality
- Leaderboard showing top performers
- Achievement cards with progress tracking
- Resource library integration
- Mentor matching suggestions
- Discussion forum preview

### Partner Dashboard
- Overview statistics (learners, completion rate, projects)
- Cohort management with creation dialog
- Growth analytics chart
- Top performers list
- Tech stack overview
- Skills distribution

### Admin Dashboard
- Platform-wide statistics
- User management table with actions
- Project moderation queue
- Cohort overview with creation
- Analytics export with multiple formats
- Time range selection for reports

## Interactive Features

### Celebration System
When a student completes day 30, they receive:
- Animated celebration modal
- Downloadable achievement badge
- Social media sharing buttons (Twitter, LinkedIn, Facebook)
- Congratulatory message

### Notification System
Real-time notifications for:
- Achievement unlocks
- New comments on projects
- Cohort updates
- Daily reminders
- Mark as read/unread functionality
- Delete notifications

### Search Functionality
Global search across:
- Pages and routes
- Learning resources
- Mentor profiles
- Upcoming events
- Type-based filtering with badges

### Comment System
- Add comments to projects and posts
- Real-time comment count updates
- User avatars and timestamps
- Nested comment threads

## Future Enhancements

- Database integration (Supabase/Neon) for persistent data
- Authentication system (NextAuth.js)
- Real-time WebSocket connections
- Advanced analytics dashboards
- Email notification system
- Mobile app (PWA) with offline support
- Multi-language support (i18n)
- AI-powered learning recommendations
- Video content integration
- Certificate generation
- Payment integration for premium features

## Performance Optimizations

- Server-side rendering (SSR) for SEO
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Optimized bundle size
- Caching strategies
- Responsive images with multiple sizes

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Alt text for all images

## License

© 2025 FolaIgnite. All rights reserved.
