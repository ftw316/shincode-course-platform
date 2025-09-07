# ShinCode Course Platform - Project Overview

## Project Purpose
This is a **Udemy-like course platform** MVP for engineers and non-engineers who want to learn AI-driven programming development. The platform delivers courses through YouTube embedded videos with a 3-tier structure: Courses → Sections → Videos.

## Key Features
- YouTube video-based course delivery
- Progress tracking functionality
- First video accessible without authentication (preview), rest requires login
- Google OAuth authentication only
- 3-tier content structure (Course → Section → Video)
- Admin panel for content management
- Responsive Udemy-inspired UI design

## Tech Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with PostCSS
- **Build Tool**: Turbopack (Next.js bundler)
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Authentication**: Google OAuth only
- **Deployment**: Vercel
- **Fonts**: Google Fonts (Geist Sans & Geist Mono)

## Database Structure
5 main tables:
- `courses` - Course information
- `sections` - Section information within courses
- `videos` - Video information within sections
- `user_progress` - User progress tracking
- `user_profiles` - Extended user profile information

## Current Development Status
Based on tickets in `/doc` folder:
- ✅ Database setup (Supabase)
- ✅ Authentication system (Google OAuth)
- ✅ Basic page structure and routing
- ✅ Course/video listing (home and course detail pages)
- 🚧 Video watching page with progress tracking
- 🔲 Profile dashboard
- 🔲 Admin panel
- 🔲 UI/UX improvements