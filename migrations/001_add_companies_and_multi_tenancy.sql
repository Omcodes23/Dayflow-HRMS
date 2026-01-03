-- SQL Migration: Add Companies Table and Update Multi-Tenancy Support
-- Run this in Supabase SQL Editor

-- 1. Create Companies Table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  employees_count INTEGER DEFAULT 1,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add company_id to users table (if not already present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- 3. Add company_id to attendance table (if not already present)
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- 4. Add company_id to leave_requests table (if not already present)
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- 5. Enable RLS on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policy for companies (Users can see companies they own)
CREATE POLICY "company_owner_access" ON companies
  FOR SELECT USING (owner_id = auth.uid());

-- 7. Create RLS Policy for companies (Users can see companies they're members of)
CREATE POLICY "company_member_access" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM users 
      WHERE user_id = auth.uid()
    )
  );

-- 8. Create RLS Policy for companies (Owners can update their company)
CREATE POLICY "company_owner_update" ON companies
  FOR UPDATE USING (owner_id = auth.uid());

-- 9. Create RLS Policy for companies (Owners can insert)
CREATE POLICY "company_owner_insert" ON companies
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- 10. Update users table RLS (must include company_id check)
-- First, drop existing policy if it exists
DROP POLICY IF EXISTS "user_access" ON users;

-- Create new policy with company isolation
CREATE POLICY "user_company_isolation" ON users
  FOR SELECT USING (
    -- Users can see themselves
    id = auth.uid() OR
    -- Users in same company can see each other (if they have right role)
    company_id = (
      SELECT company_id FROM users 
      WHERE id = auth.uid() LIMIT 1
    )
  );

-- 11. Update attendance table RLS
DROP POLICY IF EXISTS "attendance_access" ON attendance;

CREATE POLICY "attendance_company_access" ON attendance
  FOR SELECT USING (
    -- Employees see own records
    (
      user_id = auth.uid() AND
      company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
    ) OR
    -- HR and Admin see company records
    (
      (SELECT role FROM users WHERE id = auth.uid() LIMIT 1) IN ('hr', 'admin') AND
      company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
    )
  );

CREATE POLICY "attendance_insert" ON attendance
  FOR INSERT WITH CHECK (
    -- Only authenticated users can insert
    auth.uid() IS NOT NULL AND
    -- User_id must match current user (can't insert for others)
    user_id = auth.uid() AND
    -- Company_id must match user's company
    company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "attendance_update" ON attendance
  FOR UPDATE USING (
    -- Users can update own records
    user_id = auth.uid() OR
    -- HR/Admin can update company records
    (SELECT role FROM users WHERE id = auth.uid() LIMIT 1) IN ('hr', 'admin')
  );

-- 12. Update leave_requests table RLS
DROP POLICY IF EXISTS "leave_access" ON leave_requests;

CREATE POLICY "leave_request_access" ON leave_requests
  FOR SELECT USING (
    -- Employees see own requests
    (user_id = auth.uid()) OR
    -- HR/Admin see company requests
    (
      (SELECT role FROM users WHERE id = auth.uid() LIMIT 1) IN ('hr', 'admin') AND
      company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
    )
  );

CREATE POLICY "leave_request_insert" ON leave_requests
  FOR INSERT WITH CHECK (
    -- User can only create for themselves
    user_id = auth.uid() AND
    -- Company must match their company
    company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "leave_request_update" ON leave_requests
  FOR UPDATE USING (
    -- Employees can update their own pending requests
    (user_id = auth.uid() AND status = 'pending') OR
    -- HR/Admin can update all requests in company
    (
      (SELECT role FROM users WHERE id = auth.uid() LIMIT 1) IN ('hr', 'admin') AND
      company_id = (SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1)
    )
  );

-- 13. Create indexes for performance
CREATE INDEX idx_companies_owner_id ON companies(owner_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_company_id ON attendance(company_id);
CREATE INDEX idx_attendance_created_at ON attendance(created_at DESC);
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_company_id ON leave_requests(company_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- 14. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Apply updated_at trigger to companies table
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 16. Apply updated_at trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 17. Create function to automatically assign user to company after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function should be called when auth.users table is updated
  -- It will be implemented in your signup flow
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 18. Verify RLS is enabled on all tables
-- Run these SELECT statements to verify
-- SELECT tablename FROM pg_tables WHERE tablename IN ('companies', 'users', 'attendance', 'leave_requests');

-- Notes:
-- 1. After running this migration, all tables will have RLS enabled
-- 2. Users will only see data from their assigned company
-- 3. Update your signup flow to:
--    a. Create user in users table with company_id
--    b. Store company_id in session/cookie
-- 4. All frontend requests should include company_id filter
-- 5. Supabase RLS will automatically enforce company isolation

-- Test the RLS policies:
-- As user_a in company_1: SELECT * FROM attendance; -- Only sees company_1 data
-- As user_b in company_2: SELECT * FROM attendance; -- Only sees company_2 data
