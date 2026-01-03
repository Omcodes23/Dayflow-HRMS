# Dayflow HRMS - Testing Checklist

## 🎯 Testing Status: January 3, 2026

### ✅ Phase 1-6 Completed
- ✅ Currency converted to INR (₹)
- ✅ Hydration errors fixed
- ✅ Dark theme implemented
- ✅ Admin routes fixed
- ✅ Role-based access control
- ✅ Mobile responsiveness

---

## 📋 Comprehensive Testing Checklist

### 🔐 **Authentication Module**
- [ ] Sign in with Admin account (admin@dayflow.com / Admin@123)
- [ ] Sign in with HR account (hr@dayflow.com / Hr@123456)
- [ ] Sign in with Employee account (john.doe@dayflow.com / Employee@1)
- [ ] Test password validation
- [ ] Test "Remember Me" functionality
- [ ] Verify logout clears session properly
- [ ] Test password reset flow (if implemented)
- [ ] Verify tokens expire correctly

### 🏠 **Dashboard Module**
- [ ] Check-in button works
- [ ] Check-out button works
- [ ] Today's attendance card displays correctly
- [ ] Leave balance cards show correct data
- [ ] Employee stats load properly
- [ ] Admin stats visible for Admin/HR roles only
- [ ] All currency shows ₹ symbol
- [ ] Quick action buttons navigate correctly
- [ ] Recent notifications display
- [ ] Mobile layout responsive

### 👥 **Admin: Employee Management**
- [ ] View all employees list
- [ ] Add new employee with all fields
- [ ] Edit existing employee
- [ ] Search employees by name/email
- [ ] Filter by department
- [ ] Filter by status
- [ ] View employee details
- [ ] Employee status badges show correctly
- [ ] Role badges display with proper colors
- [ ] Pagination works (if implemented)
- [ ] Dark mode styling correct
- [ ] Mobile table scrolls horizontally

### 📅 **Admin: Leave Management**
- [ ] View all leave requests
- [ ] Filter by status (Pending/Approved/Rejected)
- [ ] Approve leave request
- [ ] Reject leave request with comment
- [ ] View leave details in modal
- [ ] Leave type badges show correct colors
- [ ] Employee info displays correctly
- [ ] Date ranges formatted properly
- [ ] Stats cards show accurate counts
- [ ] Mobile layout works

### 📊 **Admin: Attendance Report**
- [ ] View attendance for current month
- [ ] Switch between months
- [ ] Department-wise attendance stats
- [ ] Individual employee attendance records
- [ ] Status badges (Present/Absent/Leave)
- [ ] Attendance percentage calculation
- [ ] Export functionality (if implemented)
- [ ] Charts/graphs display correctly
- [ ] Dark mode charts readable
- [ ] Mobile table responsive

### 💰 **Admin: Payroll Management**
- [ ] View all employees with salary
- [ ] Edit salary structure
- [ ] Add salary for new employee
- [ ] Calculate gross salary correctly
- [ ] Calculate deductions (PF, Tax, PT)
- [ ] Net salary displays in INR
- [ ] Monthly payroll total accurate
- [ ] Search employees
- [ ] Stats cards show correct numbers
- [ ] All amounts formatted as ₹XX,XXX
- [ ] Mobile form layout works

### 📈 **Admin: Reports & Analytics**
- [ ] Overview tab loads
- [ ] Attendance tab shows department stats
- [ ] Leaves tab displays leave distribution
- [ ] Payroll tab shows salary breakdowns
- [ ] All currency in INR format
- [ ] Charts render correctly
- [ ] Export buttons work
- [ ] Period selector changes data
- [ ] Dark mode charts visible
- [ ] Mobile tabs scrollable

### ⏰ **Employee: Attendance**
- [ ] Today's check-in/check-out
- [ ] View attendance history
- [ ] Calendar view shows color-coded days
- [ ] Monthly summary displays
- [ ] Attendance percentage accurate
- [ ] Late arrival marked
- [ ] Half-day recorded correctly
- [ ] Mobile calendar usable

### 🏖️ **Employee: Leaves**
- [ ] View leave balances
- [ ] Apply for new leave
- [ ] Select leave type
- [ ] Choose date range
- [ ] Calculate working days
- [ ] Add reason/description
- [ ] Submit leave request
- [ ] View leave history
- [ ] Filter by status
- [ ] Cancel pending leave
- [ ] Leave balance updates after approval
- [ ] Mobile form works

### 💵 **Employee: Payroll**
- [ ] View current month salary
- [ ] View payslip history
- [ ] Salary breakdown shows correctly
- [ ] Gross salary in INR
- [ ] Deductions listed
- [ ] Net salary calculated correctly
- [ ] Download payslip (if implemented)
- [ ] Charts display properly
- [ ] All amounts with ₹ symbol
- [ ] Mobile layout readable

### 👤 **Profile Page**
- [ ] View personal information
- [ ] View employment details
- [ ] View department & designation
- [ ] Edit profile (if allowed)
- [ ] Update profile picture (if implemented)
- [ ] View attendance summary
- [ ] View leave summary
- [ ] Dark mode styling
- [ ] Mobile view complete

### ⚙️ **Settings Page**
- [ ] Account tab loads
- [ ] Security tab shows password form
- [ ] Change password works
- [ ] Password validation enforced
- [ ] Notifications tab displays preferences
- [ ] Toggle notification settings
- [ ] Appearance tab shows theme selector
- [ ] Light theme applies
- [ ] Dark theme applies
- [ ] System theme follows OS
- [ ] Language selector works
- [ ] Timezone selector works
- [ ] Admin-only company settings visible to Admin
- [ ] Save preferences button works
- [ ] Mobile tabs scrollable

### 🎨 **Theme & UI Testing**
- [ ] Light theme applies to all pages
- [ ] Dark theme applies to all pages
- [ ] System theme switches automatically
- [ ] Theme toggle in header works
- [ ] All cards have proper contrast
- [ ] Text readable in both themes
- [ ] Icons visible in both themes
- [ ] Buttons styled correctly
- [ ] Forms visible in both themes
- [ ] Tables readable in both themes
- [ ] Charts/graphs work in dark mode
- [ ] No white flashes on page load

### 📱 **Mobile Responsiveness**
- [ ] Sidebar closes after clicking link
- [ ] Mobile menu toggle works
- [ ] Header compact on mobile
- [ ] All forms fit mobile screen
- [ ] Tables scroll horizontally
- [ ] Cards stack vertically
- [ ] Touch targets large enough
- [ ] No horizontal overflow
- [ ] Text readable without zoom
- [ ] Images/icons scale properly
- [ ] Modals fit mobile screen
- [ ] Dropdowns work on touch
- [ ] Date pickers mobile-friendly

### 🛡️ **Role-Based Access Control**
- [ ] Employee cannot access /admin routes
- [ ] Employee sees "Access Denied" for admin pages
- [ ] HR can access all admin routes
- [ ] Admin can access all routes
- [ ] Manager role works (if implemented)
- [ ] Sidebar shows correct menu items per role
- [ ] RoleGuard redirects properly
- [ ] Unauthorized access redirects to signin
- [ ] Middleware protects routes
- [ ] JWT tokens validated correctly

### 💱 **Currency (INR) Verification**
- [ ] All salary amounts show ₹ symbol
- [ ] Dashboard payroll card in INR
- [ ] Admin reports all amounts in INR
- [ ] Payroll management in INR
- [ ] Employee payslip in INR
- [ ] Numbers formatted with Indian system (Lakhs/Crores)
- [ ] Decimal places handled correctly
- [ ] No $ symbols anywhere

### 🐛 **Error Handling**
- [ ] Invalid credentials show error
- [ ] Network errors handled gracefully
- [ ] 404 page for invalid routes
- [ ] Empty states show helpful messages
- [ ] Loading states display
- [ ] Form validation errors clear
- [ ] API errors displayed to user
- [ ] No console errors on any page
- [ ] No hydration errors
- [ ] No TypeScript errors in build

### ⚡ **Performance**
- [ ] Pages load within 3 seconds
- [ ] No layout shifts on load
- [ ] Images lazy load
- [ ] Smooth scrolling
- [ ] Theme switch instant
- [ ] Navigation fast
- [ ] Forms responsive to input
- [ ] No memory leaks
- [ ] Search/filter instant

### 🔄 **Data Consistency**
- [ ] Check-in updates today's attendance
- [ ] Check-out records time correctly
- [ ] Leave approval updates balance
- [ ] Salary edit reflects immediately
- [ ] Profile changes save
- [ ] Settings changes persist
- [ ] Stats refresh on data change
- [ ] Real-time updates work (if implemented)

---

## 🚀 **Production Readiness**
- [ ] All critical bugs fixed
- [ ] All TypeScript errors resolved
- [ ] Console warnings addressed
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] Error boundaries in place
- [ ] Analytics configured (if used)
- [ ] SEO meta tags added
- [ ] Performance optimized
- [ ] Security headers set
- [ ] CORS configured
- [ ] Rate limiting implemented (if needed)

---

## 📝 **Notes**
- Demo Accounts:
  - Admin: admin@dayflow.com / Admin@123
  - HR: hr@dayflow.com / Hr@123456
  - Employee: john.doe@dayflow.com / Employee@1

- Test on browsers: Chrome, Firefox, Safari, Edge
- Test on devices: Desktop, Tablet, Mobile
- Test on OS: Windows, macOS, Android, iOS

---

## ✅ **Sign-off**
- [ ] All tests passing
- [ ] QA approved
- [ ] Stakeholder review complete
- [ ] Documentation updated
- [ ] Ready for deployment

---

**Testing Date**: _____________
**Tester Name**: _____________
**Sign-off**: _____________
