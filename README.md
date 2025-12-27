# Flowva Rewards Hub - Technical Assessment

A full-stack React application recreating the Flowva Rewards page with Supabase backend integration.

## 🚀 Live Demo

[Live Deployment URL] - *To be added after deployment*

> 💡 **Demo Mode:** The app runs in demo mode for instant access. No sign-up required! Just visit the URL and explore all features with sample data.

### 🔧 Optional: Enable Real Supabase Integration

For reviewers who want to see the full Supabase integration:

1. An authentication page is available at `/auth` (not required for demo)
2. Database schema and functions are documented in `SUPABASE_SCHEMA.md`
3. To enable real auth, set `isDemoMode = false` in `app/dashboard/earn-rewards/page.tsx`

**Demo Features:**
- ✅ Full UI/UX showcase
- ✅ All interactions work
- ✅ Sample data (10 points, 2-day streak)
- ✅ No login required

## 📋 Project Overview

This project is a technical assessment submission for the React Full-Stack Developer role at Flowva. It recreates the Rewards Hub feature with:

- ✅ **Perfect UI Match**: Pixel-perfect recreation using Flowva's exact brand colors (#9013FE purple, #FF8687 coral)
- ✅ **Full Functionality**: Working points system, daily streaks, referrals, and reward redemption
- ✅ **Supabase Integration**: Real-time database, authentication, and serverless functions
- ✅ **Clean Architecture**: Well-structured components, proper state management, and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Animations**: Framer Motion
- **Icons**: Iconify (Solar icon set)
- **Notifications**: Sonner

## ✨ Features Implemented

### Tab 1: Earn Points
- [x] **Points Balance Card** - Real-time points display with progress bar
- [x] **Daily Streak Tracker** - 7-day visual calendar with check-in functionality
- [x] **Featured Tool Spotlight** - Dynamic tool promotion with point rewards
- [x] **Referral System** - Unique referral codes with copy-to-clipboard
- [x] **Share Your Stack** - Social sharing integration
- [x] **Promotional Banners** - Gradient cards for special campaigns

### Tab 2: Redeem Rewards
- [x] **Category Filters** - All Rewards, Unlocked, Locked, Coming Soon
- [x] **Rewards Grid** - Responsive card layout
- [x] **Claim Functionality** - Point deduction with validation
- [x] **Status Management** - Dynamic button states based on user points

### Additional Features
- [x] **Responsive Design** - Mobile-first approach with breakpoints
- [x] **Loading States** - Skeleton loaders and spinners
- [x] **Error Handling** - User-friendly error messages
- [x] **Toast Notifications** - Success/error feedback
- [x] **Authentication** - Supabase Auth integration

## 📁 Project Structure

```
flowva/
├── app/
│   ├── dashboard/
│   │   ├── earn-rewards/
│   │   │   └── page.tsx          # Main rewards page
│   │   ├── components/
│   │   │   ├── sidebar.tsx       # Desktop navigation
│   │   │   ├── mobile-nav.tsx    # Mobile navigation
│   │   │   ├── animated-icon.tsx # Icon animations
│   │   │   └── toaster.tsx       # Toast configuration
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard home
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   ├── supabase/
│   │   └── client.ts             # Supabase client
│   └── utils.ts                  # Utility functions
├── SUPABASE_SCHEMA.md            # Database schema documentation
└── README.md                     # This file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone [your-repo-url]
cd flowva
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `SUPABASE_SCHEMA.md`
3. Enable Email/Password auth in Authentication > Providers
4. Copy your project credentials

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - Automatically redirects to the Rewards Hub

> 💡 The root URL redirects directly to `/dashboard/earn-rewards` for immediate access.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🗄️ Database Schema

The application uses the following Supabase tables:

- **profiles** - User data, points, streaks, referral codes
- **rewards** - Reward catalog with costs and categories
- **redemptions** - Transaction history
- **featured_tools** - Dynamic tool spotlight content
- **points_transactions** - Audit log for all point changes

See `SUPABASE_SCHEMA.md` for complete SQL schema and functions.

## 🎨 Design Decisions

### Brand Colors
- Primary Purple: `#9013FE`
- Gradient: `linear-gradient(90deg, #9013FE, #FF8687)`
- Light Lavender: `#F5EBFF`
- Neutral Grays: `#F9FAFB`, `#E5E7EB`, `#6B7280`, `#111827`

### Component Architecture
- **Server Components** for initial data fetching
- **Client Components** for interactivity
- **Custom hooks** for Supabase queries
- **Optimistic updates** for better UX

### State Management
- React hooks for local state
- Supabase real-time subscriptions for live updates
- Toast notifications for user feedback

## 🚧 Assumptions & Trade-offs

### Assumptions
1. **Authentication**: Users must sign up/login to access rewards
2. **Referral Codes**: Auto-generated unique codes for each user
3. **Daily Streaks**: Reset if user misses a day
4. **Point Costs**: Based on observed values from original site

### Trade-offs
1. **Real-time Updates**: Implemented for points but not for all features (performance consideration)
2. **Image Storage**: Using external URLs instead of Supabase Storage (simplicity)
3. **Social Sharing**: Using Web Share API where available, fallback to copy link
4. **Reward Delivery**: Simulated (no actual gift card API integration)

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Works with any Next.js-compatible platform (Netlify, Railway, etc.)

## 📝 Notes

- **Performance**: Implemented lazy loading for images and code splitting
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **SEO**: Meta tags, proper heading hierarchy
- **Security**: RLS policies, input validation, XSS protection

## 👤 Author

**Jeremiah Oyedele**
- Email: oyedelejeremiah.ng@gmail.com
- GitHub: [Your GitHub Profile]

## 📄 License

This project is created as a technical assessment submission.

---

**Submission Date**: December 27, 2025  
**Deadline**: December 26, 2025  
**Contact**: hello@hostinger.com


xlLGf2kHYLzodiqt