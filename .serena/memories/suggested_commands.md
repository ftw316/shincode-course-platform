# Suggested Commands for ShinCode Course Platform

## Development Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint for code quality checks
npm run lint
```

## System Commands (Windows)
```cmd
# List directory contents
dir
ls (if using PowerShell/Git Bash)

# Navigate directories
cd <directory>

# Find files
dir /s <filename>
findstr /s /i "pattern" *.ext

# Git operations
git status
git add .
git commit -m "message"
git push
```

## Project URLs
- Development server: http://localhost:3000
- Supabase dashboard: (configured in environment)

## Environment Setup
Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## MCP Integration
This project uses MCP (Model Context Protocol) for:
- Supabase database operations
- Sequential thinking tools
- PostgREST API interactions

## Testing & Quality Assurance
- ESLint is configured with Next.js TypeScript preset
- Use `npm run lint` before commits
- TypeScript strict mode enforced
- Path aliases configured (`@/*` → `./src/*`)