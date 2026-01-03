# 🚀 Complete Testing Guide - Dayflow HRMS

## ✅ Prerequisites Completed

- ✓ All routes created and working
- ✓ shadcn/ui components integrated
- ✓ Supabase connection configured
- ✓ API endpoints created (/api/auth/register, /api/auth/login)
- ✓ Sample data seeding script ready

---

## 🧪 Step-by-Step Testing Flow

### **Phase 1: Database & Connection Verification (2 min)**

**Step 1.1: Check Diagnostics**
```
1. Open: http://localhost:3000/diagnostics
2. Verify all checks show ✓
   - Routes: All "OK"
   - API Endpoints: All "Exists"
   - Supabase: "Connected"
   - Tables: All "Exists"
```

**Step 1.2: Seed Sample Data**
```
1. Open terminal
2. Run: npm run seed
3. Should create:
   - 3 test users (employee, hr, admin)
   - 1 test company
   - Sample attendance records
   - Sample leave requests
```

---

### **Phase 2: Authentication Testing (5 min)**

**Step 2.1: Registration - New User**
```
1. Open: http://localhost:3000/auth/register
2. Fill form:
   - Name: Jane Smith
   - Email: jane@test.com
   - Password: Test@12345
   - Role: Employee
3. Click "Sign Up"
4. Expected: Redirects to /auth/login with success
5. Verify in Supabase: Check users table has new entry
```

**Step 2.2: Login - With Seeded User**
```
1. You're on /auth/login (from step 2.1)
2. Enter credentials:
   - Email: employee@test.com
   - Password: Test@12345
3. Click "Sign In"
4. Expected: Redirects to /dashboard/employee
5. Verify: Dashboard page loads
```

**Step 2.3: Login - HR User**
```
1. Go to: http://localhost:3000/auth/login
2. Enter:
   - Email: hr@test.com
   - Password: Test@12345
3. Click "Sign In"
4. Expected: Redirects to /dashboard/hr (different from employee)
```

---

### **Phase 3: Dashboard & Navigation (3 min)**

**Step 3.1: Employee Dashboard**
```
1. Login as: employee@test.com / Test@12345
2. Should see: /dashboard/employee page
3. Verify:
   - Page loads without errors
   - All shadcn/ui components display correctly
   - No 403 or permission errors
```

**Step 3.2: HR Dashboard**
```
1. Login as: hr@test.com / Test@12345
2. Should see: /dashboard/hr page
3. Verify:
   - Different layout from employee dashboard
   - All shadcn/ui components work
```

**Step 3.3: Navigation Between Pages**
```
1. From any page, test navigation:
   - Click home button → / (home page)
   - Click logout → back to /auth/login
   - Try going to /onboarding
```

---

### **Phase 4: Dark Mode Testing (2 min)**

**Step 4.1: Toggle Theme**
```
1. Look for theme toggle (sun/moon icon) - usually top right
2. Click to switch to dark mode
3. Verify: All pages switch to dark theme
4. Click again to switch back to light
5. Refresh page: Theme should persist
```

---

### **Phase 5: UI Quality Check (3 min)**

**Step 5.1: Component Styling**
```
Check all pages use proper shadcn/ui styling:

✓ Buttons: Rounded, proper colors, hover effects
✓ Inputs: Border, focus ring, placeholder text
✓ Cards: Shadow, padding, rounded corners
✓ Text: Proper font sizes and weights
✓ Colors: Consistent with theme
✓ Spacing: Proper padding/margins
```

**Step 5.2: Form Interactions**
```
1. Go to registration page
2. Leave fields empty, click "Sign Up"
   - Should show validation errors
3. Enter invalid email, click "Sign Up"
   - Should show error
4. Enter short password (< 6 chars)
   - Should show error
5. Fill all correctly and submit
   - Should succeed
```

---

### **Phase 6: Error Handling (2 min)**

**Step 6.1: Invalid Credentials**
```
1. Go to /auth/login
2. Enter:
   - Email: nonexistent@test.com
   - Password: wrong
3. Click "Sign In"
4. Expected: Error message displayed
   - "Invalid login credentials" or similar
```

**Step 6.2: Duplicate Registration**
```
1. Go to /auth/register
2. Try to register with: employee@test.com
3. Click "Sign Up"
4. Expected: Error message
   - "User already exists" or similar
```

---

## 📊 Testing Checklist

```
Phase 1 - Database:
  □ Diagnostics page shows all ✓
  □ Seed command completes successfully
  □ Sample data visible in Supabase

Phase 2 - Authentication:
  □ New user registration works
  □ Employee login works
  □ HR login works
  □ Redirects to correct dashboard

Phase 3 - Navigation:
  □ Employee dashboard loads
  □ HR dashboard loads
  □ Can navigate between pages
  □ No 403 or permission errors

Phase 4 - Theme:
  □ Dark mode toggle works
  □ Light mode toggle works
  □ Theme persists on refresh

Phase 5 - UI:
  □ All buttons styled correctly
  □ All inputs styled correctly
  □ All cards styled correctly
  □ Colors match theme
  □ Spacing is consistent

Phase 6 - Errors:
  □ Invalid login shows error
  □ Duplicate registration shows error
  □ Form validation works
```

---

## 🔧 Test Commands

```bash
# Seed sample data
npm run seed

# Build for production
npm run build

# Start dev server
npm run dev

# Type check
npm run type-check
```

---

## 📝 Test Credentials

After seeding:
```
Employee:
  Email: employee@test.com
  Password: Test@12345

HR:
  Email: hr@test.com
  Password: Test@12345

Admin:
  Email: admin@test.com
  Password: Test@12345
```

---

## 🎯 Success Criteria

**All tests pass when:**
- ✓ Diagnostics page shows 100% green
- ✓ Users can register and login
- ✓ Dashboards load with correct permissions
- ✓ All UI components styled professionally
- ✓ Dark/light mode works
- ✓ No console errors
- ✓ No hydration warnings
- ✓ Sample data persists in Supabase

---

## 🐛 Troubleshooting

**Hydration Error?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check console for specific component

**Seed fails?**
- Ensure RLS is disabled in Supabase
- Check .env.local has correct credentials
- Verify tables exist

**Login fails with 403?**
- Check Supabase RLS policies
- Verify user exists in Supabase users table
- Check auth key in .env.local

---

## ✅ Next Steps

1. Run `npm run seed`
2. Follow Phase 1 in testing flow
3. Complete all 6 phases
4. Report any failures with console errors

**All should complete in ~20 minutes!**
