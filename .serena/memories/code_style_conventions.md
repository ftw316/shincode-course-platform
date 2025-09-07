# Code Style and Conventions

## TypeScript Configuration
- **Strict mode enabled** - All TypeScript strict checks are enforced
- **Target**: ES2017
- **Module resolution**: bundler
- **Path aliases**: `@/*` maps to `./src/*`
- **JSX**: preserve (handled by Next.js)

## File Structure Conventions
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and global styles
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global Tailwind styles
│   ├── auth/              # Authentication routes
│   ├── courses/           # Course-related pages
│   │   └── [id]/          # Dynamic course pages
│   └── login/             # Login page
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase configuration and types
└── ...
```

## Naming Conventions
- **Files**: kebab-case for pages, PascalCase for components
- **Components**: PascalCase (e.g., `AuthButton.tsx`)
- **Functions**: camelCase
- **Types/Interfaces**: PascalCase (e.g., `Course`, `UserProgress`)
- **Constants**: UPPER_SNAKE_CASE

## React/Next.js Patterns
- **Server Components by default** - Use `"use client"` only when necessary
- **Async Server Components** for data fetching
- **Dynamic routes** using `[param]` syntax
- **Metadata generation** using `generateMetadata()` function
- **Error handling** with `error.tsx` and `not-found.tsx`

## Styling Approach
- **Tailwind CSS v4** with `@import "tailwindcss"` syntax
- **CSS Custom Properties** for theme variables
- **Responsive design** with mobile-first approach
- **Udemy-inspired** clean, professional UI design
- **No custom CSS** - prefer Tailwind utilities

## Import Organization
```typescript
// External libraries first
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

// Types and interfaces
import type { Course, Section, Video } from "@/lib/supabase/types";

// Components
import AuthButton from "@/components/AuthButton";
```

## Database/Supabase Patterns
- **Row Level Security (RLS)** policies implemented
- **Type safety** with generated types
- **Server-side data fetching** in Server Components
- **Separate clients** for server vs client components
- **Always use `getUser()`** instead of `getSession()` for security