# 🎯 Dayflow HRMS - Complete Setup & Testing Instructions

## ✅ What's Been Set Up

### 1. **Application Infrastructure**
- ✓ Next.js 16 with App Router
- ✓ React 19 with TypeScript
- ✓ Tailwind CSS 4 for styling
- ✓ shadcn/ui components for professional UI
- ✓ Supabase for database & auth

### 2. **Routes & Pages**
- ✓ `/` - Home page
- ✓ `/auth/login` - Login page
- ✓ `/auth/register` - Registration page
- ✓ `/dashboard/employee` - Employee dashboard
- ✓ `/dashboard/hr` - HR dashboard
- ✓ `/onboarding` - Onboarding flow
- ✓ `/diagnostics` - System health check

### 3. **Backend APIs**
- ✓ `/api/auth/register` - User registration
- ✓ `/api/auth/login` - User authentication
- ✓ `/api/diagnostics` - Connection health check

### 4. **Database Tables**
- ✓ `users` - User profiles (id, email, name, role, company_id)
- ✓ `companies` - Company info (id, name, email, industry, employees_count, owner_id)
- ✓ `attendance` - Attendance records (id, user_id, date, check_in, check_out, status)
- ✓ `leave_requests` - Leave requests (id, user_id, type, start_date, end_date, reason, status)

### 5. **UI Components**
- ✓ Button (variants: default, destructive, outline, secondary, ghost, link)
- ✓ Card (with CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- ✓ Input (styled text inputs)
- ✓ Select (dropdown selects)

### 6. **Features**
- ✓ Dark/Light theme toggle
- ✓ User authentication & authorization
- ✓ Role-based dashboards (employee vs HR)
- ✓ Professional shadcn/ui styling
- ✓ Hydration error fixes
- ✓ Error handling & validation

---

## 🚀 Quick Start (10 minutes)

### Step 1: Seed Sample Data
```bash
npm run seed
```

**Output:**
```
🌱 Starting data seed...

📝 Creating test users...
  ✓ Created: employee@test.com (employee)
  ✓ Created: hr@test.com (hr)
  ✓ Created: admin@test.com (hr)

🏢 Creating test company...
  ✓ Created: Acme Corporation

📅 Creating sample attendance records...
  ✓ Created: 15 attendance records

🏖️ Creating sample leave requests...
  ✓ Created: 2 leave requests

✅ Data seed completed!

📋 Test Credentials:
  Employee: employee@test.com / Test@12345
  HR:       hr@test.com / Test@12345
  Admin:    admin@test.com / Test@12345
```

### Step 2: Start Dev Server
```bash
npm run dev
```

Server runs on: **http://localhost:3000**

### Step 3: Visit Diagnostics
Go to: **http://localhost:3000/diagnostics**

Should show all ✓ green checks:
- ✓ All routes accessible
- ✓ All APIs exist
- ✓ Supabase connected
- ✓ All tables exist

---

## 🧪 Testing Workflow

### Test 1: Registration (New User)
```
1. Go to: http://localhost:3000/auth/register
2. Fill form:
   - Name: Jane Smith
   - Email: jane@example.com
   - Password: Test@12345
   - Role: Employee
3. Click "Sign Up"
4. Expected: Redirects to login ✓
```

### Test 2: Login (Seeded User)
```
1. Go to: http://localhost:3000/auth/login
2. Enter:
   - Email: employee@test.com
   - Password: Test@12345
3. Click "Sign In"
4. Expected: Redirects to /dashboard/employee ✓
```

### Test 3: Employee Dashboard
```
1. After login, you're on: /dashboard/employee
2. Verify:
   - Page loads without 403 errors
   - UI looks professional with shadcn/ui
   - Can see employee-specific content
```

### Test 4: HR Dashboard
```
1. Logout and login as:
   - Email: hr@test.com
   - Password: Test@12345
2. Expected: Redirects to /dashboard/hr ✓
3. Should have different layout for HR
```

### Test 5: Dark Mode
```
1. Look for sun/moon icon (usually top right)
2. Click to toggle dark mode
3. All pages should switch theme
4. Refresh page - theme should persist
```

### Test 6: Diagnostics
```
1. Go to: http://localhost:3000/diagnostics
2. Verify:
   - All routes show ✓ OK
   - All APIs show ✓ Exists
   - Supabase shows ✓ Connected
   - Tables show ✓ Exists
```

---

## 🔍 Verification Checklist

**Before Declaring Success:**

### Routes ✓
```
□ http://localhost:3000 (home) - loads
□ http://localhost:3000/auth/register - loads
□ http://localhost:3000/auth/login - loads
□ http://localhost:3000/dashboard/employee - loads after login
□ http://localhost:3000/dashboard/hr - loads after HR login
□ http://localhost:3000/onboarding - loads
□ http://localhost:3000/diagnostics - shows all green
```

### Authentication ✓
```
□ Can register new user
□ Can login with registered credentials
□ Can login with seeded credentials
□ Correct dashboard redirect based on role
□ Invalid credentials show error
□ Duplicate registration shows error
```

### UI/UX ✓
```
□ All buttons use shadcn/ui styling
□ All inputs use shadcn/ui styling
□ All cards use shadcn/ui styling
□ Colors match theme (light/dark)
□ No hydration errors in console
□ No 403 permission errors
□ Responsive design works on mobile
```

### Database ✓
```
□ New users saved to Supabase
□ User profiles created
□ Sample data inserted from seed
□ Can query data via diagnostics
□ Dark/light theme persists in storage
```

---

## 🔧 Important Environment Variables

Your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://dbyyyvuhjqqjbeooarus.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8A1_tZb7k29tfg5kFrcxVg_9J3yDtZA
```

These are already configured ✓

---

## 📊 Database Schema

### users table
```typescript
{
  id: string (UUID)
  email: string (unique)
  name: string
  role: 'employee' | 'hr'
  company_id: string (nullable)
  created_at: timestamp
}
```

### companies table
```typescript
{
  id: string (UUID)
  name: string
  email: string
  industry: string
  employees_count: number
  owner_id: string (user ID)
  created_at: timestamp
}
```

### attendance table
```typescript
{
  id: string (UUID)
  user_id: string
  date: date
  check_in: timestamp (nullable)
  check_out: timestamp (nullable)
  status: 'present' | 'absent' | 'late'
  created_at: timestamp
}
```

### leave_requests table
```typescript
{
  id: string (UUID)
  user_id: string
  type: 'vacation' | 'sick' | 'personal'
  start_date: date
  end_date: date
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: timestamp
}
```

---

## 🎨 UI Components Used

All components from shadcn/ui:

- **Button** - with variants (default, destructive, outline, secondary, ghost, link)
- **Card** - with subcomponents (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Input** - styled text inputs
- **Form elements** - labels, selects, validations

All styled with Tailwind CSS and follow shadcn/ui best practices.

---

## 🐛 Common Issues & Fixes

**Issue: Hydration Error**
- Solution: Clear cache (Ctrl+Shift+Delete) and refresh

**Issue: 403 Permission Denied**
- Solution: Verify RLS is disabled in Supabase for all tables

**Issue: Can't login**
- Solution: Verify user exists in Supabase users table

**Issue: Dark mode not working**
- Solution: Check Providers component has theme provider

**Issue: Seed fails**
- Solution: Ensure SUPABASE_SERVICE_KEY or ANON_KEY is set

---

## 📝 Commands Reference

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Build for production
npm run start            # Start production server

# Data
npm run seed             # Insert sample data into Supabase

# Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checker
```

---

## ✅ Success Indicators

You're done when:

1. **Diagnostics page shows 100% green** ✓
2. **Can register and login** ✓
3. **Dashboard loads with correct permissions** ✓
4. **UI looks professional with shadcn/ui** ✓
5. **Dark/light mode works** ✓
6. **No console errors** ✓
7. **Sample data visible in Supabase** ✓

---

## 📞 Support

If you encounter issues:

1. Check the browser console (F12)
2. Check server logs in terminal
3. Visit diagnostics page for connection status
4. Verify Supabase dashboard for data

---

**Ready to get started? Run `npm run seed` then `npm run dev`!**
