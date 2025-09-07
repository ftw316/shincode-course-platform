# Development Tickets and Priorities

## Ticket System Overview
Development is organized into 8 main tickets located in `/doc/` folder:

## Completed Tickets ✅
- **#001**: Database design & setup (Supabase)
- **#002**: Authentication system (Google OAuth)
- **#003**: Basic page structure and routing
- **#004**: Course/video listing display

## In Progress Tickets 🚧
- **#005**: Video watching page with progress tracking
  - YouTube video embedding
  - Progress management
  - Authentication-based access control

## Pending Tickets 🔲  
- **#006**: Profile dashboard
- **#007**: Admin panel (course/video management)
- **#008**: UI/UX improvements

## Development Priority Order
1. Complete video watching functionality (#005)
2. Implement admin panel (#007) - Critical for content management
3. Add user profile/dashboard (#006)
4. Polish UI/UX (#008)

## Key Requirements for Each Ticket
- Update TODO checkboxes when completed
- Follow security best practices (RLS, getUser() vs getSession())
- Implement proper error handling
- Ensure responsive design
- Use MCP for database operations
- Run lint and build checks before completion

## MCP Integration Notes
- Use `mcp__supabase__postgrestRequest` for database operations
- Use `mcp__context7__get-library-docs` for documentation
- Follow Supabase security guidelines
- Always implement proper TypeScript typing

## Current Focus
The next priority is completing ticket #005 (video watching page) which requires:
- YouTube video embedding
- Progress tracking functionality  
- User authentication checks
- Responsive video player interface
- Navigation between course videos