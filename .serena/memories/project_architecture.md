# Project Architecture

## Next.js 15 App Router Structure
```
src/app/
├── layout.tsx              # Root layout with fonts and global styles
├── page.tsx               # Home page (course listing)
├── globals.css            # Tailwind imports and CSS custom properties
├── favicon.ico            # Favicon
├── auth/                  # Authentication routes
│   ├── callback/          # OAuth callback handling
│   │   └── route.ts       # Server-side auth callback
│   └── signout/           # Sign out handling
│       └── route.ts       # Server-side sign out
├── login/                 # Login page
│   └── page.tsx          # Login form with Google OAuth
└── courses/              # Course-related pages
    └── [id]/             # Dynamic course pages
        ├── page.tsx      # Course detail page
        └── not-found.tsx # 404 for missing courses
```

## Component Architecture
```
src/components/
├── AuthButton.tsx         # Authentication button (login/logout)
├── GoogleSignInButton.tsx # Google OAuth sign-in component
└── NoSSR.tsx             # Client-side only wrapper
```

## Library Structure
```
src/lib/
└── supabase/
    ├── client.ts         # Client-side Supabase instance
    ├── server.ts         # Server-side Supabase instance
    ├── middleware.ts     # Auth middleware utilities
    └── types.ts          # TypeScript interfaces for database
```

## Database Schema (Supabase)
- **courses**: Course information with publish status
- **sections**: Ordered sections within courses
- **videos**: YouTube videos within sections
- **user_progress**: Video completion tracking
- **user_profiles**: Extended user information

## Authentication Flow
1. Google OAuth through Supabase Auth
2. Callback handling in `/auth/callback/route.ts`
3. Session management via middleware
4. RLS policies for data access control

## Data Fetching Strategy
- **Server Components**: Direct database queries for initial page loads
- **Async/await**: Server-side data fetching with proper error handling
- **Type safety**: All database interactions are typed
- **Security**: Always use `getUser()` for authentication checks

## Styling System
- **Tailwind CSS v4**: Latest version with new features
- **PostCSS**: Integrated processing
- **CSS Custom Properties**: Theme variables for consistency
- **Responsive**: Mobile-first design approach
- **Professional**: Udemy-inspired clean interface