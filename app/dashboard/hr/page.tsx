'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'
import { EmployeeList } from '@/components/EmployeeList'
import { AttendanceTable } from '@/components/AttendanceTable'
import { LeaveApprovalPanel } from '@/components/LeaveApprovalPanel'
import { PayrollPanel } from '@/components/PayrollPanel'

export default function HRDashboard() {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/auth/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userData?.role !== 'hr') {
        router.push('/dashboard/employee')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <EmployeeList
              onSelectEmployee={setSelectedEmployee}
              selectedId={selectedEmployee?.id}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedEmployee ? (
              <>
                <AttendanceTable employeeId={selectedEmployee.id} />
                <PayrollPanel employeeId={selectedEmployee.id} />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Select an employee to view details
              </div>
            )}

            <LeaveApprovalPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
