export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          company_id: string | null
          created_at: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          email: string
          industry: string
          employees_count: number
          owner_id: string
          created_at: string
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          date: string
          check_in: string | null
          check_out: string | null
          status: string
          created_at: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          user_id: string
          type: string
          start_date: string
          end_date: string
          reason: string
          status: string
          created_at: string
        }
      }
    }
  }
}
