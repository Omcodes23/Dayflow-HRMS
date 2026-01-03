# Dayflow HRMS - Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### 1. Install & Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Create Account
- Click "Register"
- Enter email and password
- Click "Create Company" on onboarding page
- Fill company details
- Access dashboard

---

## 📱 User Interfaces

### Employee Dashboard
```
URL: /dashboard/employee
Displays:
- Attendance Card (Today's check-in/out)
- Leave Balance Card (Days remaining)
- Quick Actions (Check-in, Check-out, Request Leave)
- Attendance History (Last 7 days)
```

### HR Dashboard
```
URL: /dashboard/hr
Displays:
- Pending Leave Requests
- Employee Directory
- Attendance Reports
- Leave Statistics
```

---

## 🎛️ Theme Toggle

### How to Use
1. Look for sun/moon icon (top-right typically)
2. Click to toggle light/dark mode
3. Setting persists automatically

### CSS Variables
Dark mode uses CSS variables for all colors:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --primary: 217 91% 60%;
}

.dark {
  --background: 217 33% 17%;
  --foreground: 210 40% 98%;
}
```

---

## 🏢 Company Management

### Create Company (First Time)
1. Register account
2. Click "Create New Company"
3. Fill form:
   - **Name**: Company name (required)
   - **Email**: Company email (required)
   - **Industry**: Select from dropdown
   - **Employees**: Expected employee count
4. Click "Create Company"

### Switch Between Companies
1. Go to settings/profile
2. Select company from dropdown
3. Dashboard updates to show company data

---

## ✋ Attendance

### Check In
```
1. Go to Employee Dashboard
2. Click "Check-in" button
3. Current time recorded
4. Button shows "Checked in at 09:15 AM"
```

### Check Out
```
1. When leaving, click "Check-out"
2. System calculates hours worked
3. Button shows "Checked out at 05:45 PM"
4. Total: "8 hours 30 minutes"
```

### View History
```
1. Scroll down to "Attendance History"
2. Shows last 7 days
3. Click date for details
4. Download option for reports
```

---

## 🏖️ Leave Management

### Request Leave
```
1. Click "Request Leave" on dashboard
2. Fill form:
   - Leave Type (Sick/Vacation/Personal)
   - Start Date
   - End Date
   - Reason (optional)
3. Click "Submit"
4. HR gets notification
5. Status shows "Pending Approval"
```

### HR: Approve/Reject
```
1. Go to HR Dashboard
2. See "Pending Leave Requests"
3. Click request
4. Click "Approve" or "Reject"
5. Employee notified
6. Balance updated (if approved)
```

### Check Balance
```
1. Look at "Leave Balance" card
2. Shows: "18 of 20 days"
3. Click for breakdown by type:
   - Sick: 5/5
   - Vacation: 13/15
   - Personal: 0/5
```

---

## 🔐 Authentication

### Login
```
Email: your@email.com
Password: yourpassword
→ Select company (if multiple)
→ Dashboard loads
```

### Register
```
Email: new@email.com
Password: (min 8 chars)
Confirm: same password
→ Account created
→ Go to company creation
```

### Logout
```
Click profile/menu
Select "Logout"
→ Redirected to /login
```

---

## 📊 Reports

### Attendance Report
```
HR Dashboard → "Attendance Reports"
- Select date range
- Filter by employee (optional)
- Download as CSV/PDF
Shows:
- Check-in/out times
- Duration
- Total hours
```

### Leave Report
```
HR Dashboard → "Leave Statistics"
- By employee
- By leave type
- By status (approved/rejected)
- Trends over time
```

---

## 👥 User Roles

### Admin (Owner)
Can:
- Create company
- Invite team
- Approve leaves
- View all data
- Configure settings

### HR Manager
Can:
- View employees
- Approve leaves
- Generate reports
- Update employee info

### Employee
Can:
- Check-in/out
- Request leave
- View own data
- Update profile

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```javascript
extend: {
  colors: {
    primary: '#your-color'
  }
}
```

### Modify Leave Types
Edit `types/index.ts`:
```typescript
interface LeaveRequest {
  leave_type: 'sick' | 'vacation' | 'personal' | 'unpaid'
}
```

### Add New Dashboard Sections
Create component in `components/`:
```typescript
export function NewCard() {
  return <div>...</div>
}
```

---

## 🐛 Troubleshooting

### Can't check in?
- [ ] Are you logged in?
- [ ] Is it during allowed hours (6 AM - 10 PM)?
- [ ] Did you already check in today?
- [ ] Is network working?

### Theme not saving?
- [ ] Clear localStorage: DevTools → Application → Storage
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check next-themes installed

### Leave not approving?
- [ ] Do you have 'hr' or 'admin' role?
- [ ] Is leave status 'pending'?
- [ ] Check browser console for errors

### Company data showing wrong?
- [ ] Is company_id in session storage?
- [ ] Are you in correct company?
- [ ] Try switching companies and back

---

## 📂 Key File Locations

```
Authentication:
└── app/auth/login|register/page.tsx

Dashboard:
└── app/dashboard/employee|hr/page.tsx

Onboarding:
└── app/onboarding/page.tsx

Components:
├── components/CompanyCreationModal.tsx
├── components/OnboardingPage.tsx
├── components/ThemeToggle.tsx
└── components/ProfileCard.tsx (+ others)

Types:
└── types/index.ts

Styling:
├── tailwind.config.ts
└── app/globals.css

Database:
└── migrations/001_add_companies_and_multi_tenancy.sql
```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://app.supabase.com |
| Vercel Dashboard | https://vercel.com |
| Next.js Docs | https://nextjs.org/docs |
| Tailwind Docs | https://tailwindcss.com |
| Supabase Docs | https://supabase.com/docs |

---

## 💡 Tips & Tricks

1. **Use SessionStorage**: Store company_id in sessionStorage for quick access
2. **Dark Mode Toggle**: Add to every page layout for consistency
3. **Real-time Updates**: Use Supabase subscriptions for live notifications
4. **Optimize Images**: Use next/image for automatic optimization
5. **Type Safety**: Always use TypeScript interfaces for data

---

## 📞 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Create production build
npm run start           # Run production server

# Code Quality
npm run lint            # Check for linting errors
npm run type-check      # Check TypeScript types

# Database
# (Run in Supabase SQL editor)
# Copy from migrations/ folder
```

---

## 🎯 Next Steps

### After Setup
1. Test user registration flow
2. Create first company
3. Test attendance tracking
4. Test leave request workflow
5. Switch to dark mode
6. Deploy to Vercel

### For Development
1. Add more components
2. Implement notifications
3. Add reporting features
4. Create mobile app
5. Add integrations

---

## 📈 Feature Checklist

Core Features:
- [x] User authentication
- [x] Company creation
- [x] Company isolation
- [x] Attendance tracking
- [x] Leave management
- [x] Role-based access
- [x] Dark/light theme

Upcoming:
- [ ] Employee invitations
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced reports
- [ ] Payroll integration
- [ ] Performance reviews

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready

For detailed documentation, see:
- `TESTING_AND_USER_FLOW.md` - Complete workflows
- `IMPLEMENTATION_GUIDE.md` - Setup instructions
- `README_COMPLETE.md` - Full documentation
