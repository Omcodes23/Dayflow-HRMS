'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, LeaveRequest } from '@/types'
import { ProfileCard } from '@/components/ProfileCard'
import { AttendanceCard } from '@/components/AttendanceCard'
import { LeaveCard } from '@/components/LeaveCard'

export default function EmployeeDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
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

      if (userData?.role !== 'employee') {
        router.push('/dashboard/hr')
        return
      }

      setUser(userData as User)
      await fetchLeaveRequests(authUser.id)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  async function fetchLeaveRequests(userId: string) {
    const { data } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setLeaveRequests(data || [])
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileCard user={user} />
          <AttendanceCard userId={user?.id || ''} />
          <LeaveCard
            userId={user?.id || ''}
            leaveRequests={leaveRequests}
            onRefresh={() => fetchLeaveRequests(user?.id || '')}
          />
        </div>
      </div>
    </div>
  )
}
