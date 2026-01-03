"# Dayflow – Human Resource Management System (HRMS)

## Overview
Dayflow is a lightweight, production-ready HRMS that digitizes employee onboarding, attendance tracking, leave management, and role-based approvals. Built with Next.js 14, Tailwind CSS, and Supabase.

**Every workday, perfectly aligned.**

## ✨ Features

### 🔐 Authentication & Authorization
- Email/password registration and login
- Role-based access control (Employee | HR)
- Secure password handling with Supabase Auth

### 👤 Employee Features
- View personal profile
- Daily check-in/check-out with timestamp tracking
- View own attendance history (daily/weekly)
- Apply for leaves (Paid/Sick/Unpaid)
- View leave request status
- Read-only salary view

### 👨‍💼 HR/Admin Features
- View all employees
- View attendance records for all employees
- Approve/reject leave requests
- Update employee details
- View payroll information
- Manage leave workflow

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router, TypeScript) |
| **UI** | Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (BaaS) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth |
| **Hosting** | Vercel |

---

## 📁 Project Structure

```
dayflow/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── employee/page.tsx
│   │   └── hr/page.tsx
│   ├── api/
│   │   ├── attendance/
│   │   └── leave/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AttendanceCard.tsx
│   ├── AttendanceTable.tsx
│   ├── EmployeeList.tsx
│   ├── LeaveApprovalPanel.tsx
│   ├── LeaveCard.tsx
│   ├── PayrollPanel.tsx
│   └── ProfileCard.tsx
├── lib/
│   ├── auth.ts
│   └── supabase.ts
├── types/
│   └── index.ts
└── public/
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/dayflow.git
cd dayflow
npm install
```

### 2. Set up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Note your project URL and Anon Key

#### Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('employee', 'hr')),
  phone TEXT,
  address TEXT,
  salary NUMERIC DEFAULT 50000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half-day', 'leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create leave_requests table
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('paid', 'sick', 'unpaid')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
```

#### Set up Row Level Security Policies

```sql
-- Users RLS Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "HR can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr'
    )
  );

-- Attendance RLS Policies
CREATE POLICY "Employees can view own attendance" ON attendance
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr'
    )
  );

CREATE POLICY "Employees can insert own attendance" ON attendance
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employees can update own attendance" ON attendance
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Leave Requests RLS Policies
CREATE POLICY "Users can view own leave requests" ON leave_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr'
    )
  );

CREATE POLICY "Employees can apply for leave" ON leave_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "HR can approve/reject leave" ON leave_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'hr'
    )
  );
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables in Vercel dashboard.

---

## 📊 Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auth.uid) |
| employee_id | TEXT | Unique employee identifier |
| name | TEXT | Employee name |
| email | TEXT | Email address |
| role | TEXT | 'employee' or 'hr' |
| phone | TEXT | Contact number |
| address | TEXT | Address |
| salary | NUMERIC | Monthly salary |

### attendance
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| date | DATE | Attendance date |
| check_in | TIMESTAMP | Check-in time |
| check_out | TIMESTAMP | Check-out time |
| status | TEXT | present/absent/half-day/leave |

### leave_requests
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| from_date | DATE | Leave start date |
| to_date | DATE | Leave end date |
| type | TEXT | paid/sick/unpaid |
| status | TEXT | pending/approved/rejected |
| remarks | TEXT | Additional notes |

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** - Database-enforced access control
✅ **Password Hashing** - Handled by Supabase Auth
✅ **Role-Based Access** - Frontend + Backend validation
✅ **Secure API Routes** - Server-side authentication checks
✅ **Environment Variables** - Sensitive data protected

---

## 📝 API Routes

### Attendance
- `POST /api/attendance` - Create/update attendance record
- `GET /api/attendance?user_id=...` - Fetch attendance records

### Leave
- `POST /api/leave` - Apply for leave
- `PATCH /api/leave/:id` - Approve/reject leave (HR only)

---

## 🎯 Key Components

### ProfileCard
Displays employee personal information and details.

### AttendanceCard
Allows employees to check-in/check-out with status tracking.

### LeaveCard
Interface for applying for leave with pending requests display.

### AttendanceTable
HR view of all employee attendance records.

### LeaveApprovalPanel
HR panel for approving/rejecting pending leave requests.

### PayrollPanel
Salary breakdown and net salary calculation.

---

## 🧪 Testing

### Test Users

Create these accounts during testing:

**Employee Account**
- Email: employee@test.com
- Password: TestPass123!
- Role: Employee

**HR Account**
- Email: hr@test.com
- Password: TestPass123!
- Role: HR

---

## 📈 Future Enhancements

- [ ] Email notifications for leave approvals
- [ ] Attendance analytics dashboard
- [ ] Advanced payroll with tax calculations
- [ ] Document management
- [ ] Performance review module
- [ ] Mobile app
- [ ] Integration with email services

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Supabase Connection Issues
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure RLS policies are correctly set

### Authentication Not Working
- Check Supabase Auth providers are enabled
- Verify email is not already registered
- Clear browser cookies and try again

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For issues, feature requests, or questions:
- Open a GitHub issue
- Contact: support@dayflow.io

---

**Built with ❤️ for better HR management**" 
