# Login Troubleshooting Guide

## Common Login Issues and Solutions

### Issue: "Failed to login" error

This error can occur for several reasons. The enhanced login system now provides more detailed error messages to help diagnose the issue.

### Possible Causes and Solutions:

#### 1. **Database Connection Issues**
**Symptoms:** Error message mentions "Database connection failed" or "Cannot reach database server"

**Solutions:**
- Check your `.env` file has a valid `DATABASE_URL`
- Verify your database server is running
- Test connection: `npx prisma db push`
- Check network connectivity if using remote database

#### 2. **Database Not Migrated**
**Symptoms:** Error message mentions "Database does not exist" or table-related errors

**Solutions:**
```powershell
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev
```

#### 3. **No User Account Exists**
**Symptoms:** "Invalid email or password" with correct credentials

**Solutions:**
- Create a test user using the provided script:
```powershell
npx tsx scripts/create-test-user.ts your-email@example.com yourpassword "Your Name"
```

- Or register a new account through the `/register` page

#### 4. **Wrong Email or Password**
**Symptoms:** "Invalid email or password"

**Solutions:**
- Double-check your email and password
- Ensure caps lock is not on
- Try registering if you don't have an account
- Use the test account: 
  - Email: `test@researchos.com`
  - Password: `password123`

#### 5. **Cookie/Session Issues**
**Symptoms:** Login succeeds but immediately redirects back or session not maintained

**Solutions:**
- Clear browser cookies and cache
- Check browser console for cookie-related errors
- Verify `NEXTAUTH_SECRET` or `JWT_SECRET` is set in `.env`
- Try in incognito/private browsing mode

## Viewing Server Logs

The enhanced login endpoint now logs detailed information. Check your terminal where the dev server is running for logs like:

```
Login attempt for email: user@example.com
User found: user@example.com
Password verified, setting auth cookie
Login successful for user: user@example.com
```

## Testing the Login

### 1. Check if test user exists:
```powershell
npx tsx scripts/create-test-user.ts test@researchos.com password123
```

### 2. Test login with curl:
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@researchos.com","password":"password123"}'
```

### 3. Check database connection:
```powershell
npx prisma studio
```

## Environment Variables Checklist

Ensure these are set in your `.env` file:
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NEXTAUTH_SECRET` or `JWT_SECRET` - Secret key for JWT tokens
- ✅ `NODE_ENV` - Set to `development` or `production`

## Recent Improvements

The login system has been enhanced with:
1. **Database connection validation** - Tests connection before attempting login
2. **Detailed error logging** - Server-side logs for debugging
3. **Specific error messages** - Better error messages for different failure scenarios
4. **Frontend error handling** - Improved error display and logging
5. **Test user creation script** - Easy way to create test accounts

## Still Having Issues?

If you're still experiencing problems:

1. Check the terminal output where `npm run dev` is running
2. Check browser console (F12) for frontend errors
3. Verify your database is accessible: `npx prisma studio`
4. Try creating a fresh user account
5. Restart the development server

## Contact

If the issue persists, please provide:
- Error message from the UI
- Server logs from terminal
- Browser console errors
- Database connection test results
