# Task Completion Workflow

## When a Task is Completed

### 1. Code Quality Checks
Run the following commands in order:
```bash
npm run lint    # ESLint code quality check
npm run build   # Verify production build works
```

### 2. Documentation Updates
- Update TODO checkboxes in relevant ticket files (`doc/*.md`)
- Mark completed items as `[x]` 
- Update progress status in completion conditions
- Use TodoWrite tool for tracking progress during development

### 3. Git Operations (if requested by user)
```bash
git status      # Check current changes
git add .       # Stage changes
git commit -m "descriptive message"  # Commit with clear message
# Note: Only push if explicitly requested
```

### 4. Testing Verification
- Verify development server runs without errors: `npm run dev`
- Test functionality in browser at http://localhost:3000
- Check responsive design on different screen sizes
- Verify authentication flows work correctly

### 5. Error Handling
- Ensure proper error boundaries are in place
- Verify `not-found.tsx` pages work correctly
- Test edge cases (empty data, failed API calls, etc.)

### 6. Security Verification
- Verify RLS policies are working (authenticated vs non-authenticated access)
- Check that sensitive data is not exposed in client components
- Ensure `getUser()` is used instead of `getSession()` for security

### 7. Performance Checks
- Verify Server Components are used by default
- Minimize Client Components (`"use client"`)
- Check that images use `next/image` component
- Verify proper caching strategies are in place

### 8. Documentation Reminder
Based on CLAUDE.md instructions:
- Always update TODO checkboxes when tasks are completed
- Follow the rule: "毎回、Todoにチェック入れるのを忘れているので" (Don't forget to check TODOs every time)
- Update ticket completion status systematically