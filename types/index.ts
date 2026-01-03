export interface Company {
  id: string
  name: string
  email: string
  industry: string
  employees_count: number
  owner_id: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  employee_id: string
  name: string
  email: string
  role: 'employee' | 'hr' | 'admin'
  phone: string
  address: string
  salary: number
  company_id: string
  company?: Company
}

export interface Attendance {
  id: string
  user_id: string
  company_id: string
  date: string
  check_in: string | null
  check_out: string | null
  status: 'present' | 'absent' | 'half-day' | 'leave'
}

export interface LeaveRequest {
  id: string
  user_id: string
  company_id: string
  from_date: string
  to_date: string
  type: 'paid' | 'sick' | 'unpaid'
  status: 'pending' | 'approved' | 'rejected'
  remarks: string
  created_at: string
}
