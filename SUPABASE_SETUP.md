# Supabase Setup Guide for Dayflow HRMS

## Step-by-Step Supabase Configuration

### 1. Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new organization
4. Create a new project:
   - **Name:** Dayflow
   - **Database Password:** Choose a strong password and save it
   - **Region:** Choose closest to you
5. Wait for project to initialize (2-3 minutes)

### 2. Get Your Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public) Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Save these in your `.env.local` file.

### 3. Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the entire SQL schema below
4. Click "RUN"

```sql
-- ===========================
-- TABLE: users
-- ===========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'hr')),
  phone TEXT,
  address TEXT,
  salary NUMERIC NOT NULL DEFAULT 50000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- TABLE: attendance
-- ===========================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half-day', 'leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- ===========================
-- TABLE: leave_requests
-- ===========================
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('paid', 'sick', 'unpaid')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- INDEXES (Performance)
-- ===========================
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_date_range ON leave_requests(from_date, to_date);

-- ===========================
-- ENABLE ROW LEVEL SECURITY
-- ===========================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
```

### 4. Create Security Policies (RLS)

Create a new SQL query for each policy block below.

#### Users Table Policies

```sql
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Policy 2: HR can view all user profiles
CREATE POLICY "HR can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);

-- Policy 3: Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = 'employee');

-- Policy 4: HR can update any user profile
CREATE POLICY "HR can update users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);
```

#### Attendance Table Policies

```sql
-- Policy 1: Users can view own attendance
CREATE POLICY "Users can view own attendance"
ON attendance FOR SELECT
USING (user_id = auth.uid());

-- Policy 2: HR can view all attendance
CREATE POLICY "HR can view all attendance"
ON attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);

-- Policy 3: Users can insert own attendance
CREATE POLICY "Users can insert own attendance"
ON attendance FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy 4: Users can update own attendance
CREATE POLICY "Users can update own attendance"
ON attendance FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 5: HR can update any attendance
CREATE POLICY "HR can update attendance"
ON attendance FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);
```

#### Leave Requests Table Policies

```sql
-- Policy 1: Users can view own leave requests
CREATE POLICY "Users can view own leave requests"
ON leave_requests FOR SELECT
USING (user_id = auth.uid());

-- Policy 2: HR can view all leave requests
CREATE POLICY "HR can view all leave requests"
ON leave_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);

-- Policy 3: Users can insert own leave requests
CREATE POLICY "Users can insert leave requests"
ON leave_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy 4: HR can approve/reject leave
CREATE POLICY "HR can update leave requests"
ON leave_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'hr'
  )
);
```

### 5. Enable Signup & Email Verification

1. Go to **Authentication** → **Providers**
2. Ensure "Email" provider is enabled
3. Go to **Settings** → **Auth**
4. Configure:
   - **Email Confirmations:** Disable (for testing) or Enable (for production)
   - **Redirect URLs:** Add `http://localhost:3000/dashboard/employee` and `http://localhost:3000/dashboard/hr`

### 6. Create Test Users (Optional but Recommended)

You can create test users through the app or via Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click "Add user"

**Test Employee:**
- Email: employee@dayflow.test
- Password: TestPass@123
- Auto generate password: Unchecked

**Test HR:**
- Email: hr@dayflow.test
- Password: TestPass@123
- Auto generate password: Unchecked

Then manually insert their profiles via SQL:

```sql
-- Insert test employee (replace id with actual auth user id)
INSERT INTO users (id, employee_id, name, email, role, phone, address, salary)
VALUES (
  'YOUR_EMPLOYEE_USER_ID',
  'EMP001',
  'John Doe',
  'employee@dayflow.test',
  'employee',
  '9876543210',
  '123 Main Street',
  50000
);

-- Insert test HR (replace id with actual auth user id)
INSERT INTO users (id, employee_id, name, email, role, phone, address, salary)
VALUES (
  'YOUR_HR_USER_ID',
  'HR001',
  'Jane Smith',
  'hr@dayflow.test',
  'hr',
  '9876543210',
  '456 Admin Road',
  80000
);
```

### 7. Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see three tables:
   - ✅ users
   - ✅ attendance
   - ✅ leave_requests
3. Each table should show "RLS enabled" (look for the lock icon)

### 8. Update Your .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

---

## Testing RLS Policies

To verify RLS is working:

1. Sign in as Employee
2. Try to view HR-only data (should be restricted)
3. Sign in as HR
4. Verify you can see all employee data

---

## Troubleshooting

### Tables not appearing?
- Refresh the page
- Check that schema "public" is selected
- Verify SQL executed without errors

### RLS policies not working?
- Ensure `ENABLE ROW LEVEL SECURITY` ran on each table
- Check policy names in Policy Details
- Try signing out and back in

### Can't sign up?
- Check email provider is enabled in Auth settings
- Verify redirect URLs are configured
- Check email for confirmation link

---

## Production Checklist

Before deploying to production:

- [ ] Enable email verification
- [ ] Set proper CORS origins in Auth
- [ ] Review all RLS policies
- [ ] Set up email templates
- [ ] Configure backup schedule
- [ ] Enable database backups
- [ ] Set up monitoring & alerts
- [ ] Use strong admin password
- [ ] Enable 2FA for Supabase account

---

**Dayflow is now ready to use! 🎉**
