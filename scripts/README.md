# Scripts Directory

This directory contains utility scripts for managing the ResearchOS application.

## Available Scripts

### create-test-user.ts

Creates a test user account in the database for testing login functionality.

**Usage:**
```powershell
# Basic usage with defaults (test@example.com / password123 / Test User)
npx tsx scripts/create-test-user.ts

# Custom email, password, and name
npx tsx scripts/create-test-user.ts your-email@example.com yourpassword "Your Name"

# Just email and password (name defaults to "Test User")
npx tsx scripts/create-test-user.ts user@example.com mypassword123
```

**Examples:**
```powershell
# Create default test user
npx tsx scripts/create-test-user.ts

# Create user for research testing
npx tsx scripts/create-test-user.ts researcher@university.edu research123 "Dr. Jane Smith"

# Create admin user
npx tsx scripts/create-test-user.ts admin@researchos.com adminpass "Admin User"
```

**Output:**
- If successful, displays user details
- If user already exists, shows existing user information
- Returns appropriate exit codes for scripting

## Prerequisites

Make sure you have:
1. Database configured and accessible (check `.env` for `DATABASE_URL`)
2. Prisma client generated: `npx prisma generate`
3. Database schema up to date: `npx prisma db push`
4. tsx installed: `npm install -D tsx` (automatically installed with dependencies)

## Adding New Scripts

When adding new scripts:
1. Use TypeScript for type safety
2. Add clear usage instructions in this README
3. Include error handling
4. Log success/failure appropriately
5. Use proper exit codes
