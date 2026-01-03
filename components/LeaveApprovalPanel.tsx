'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LeaveRequest } from '@/types'

export function LeaveApprovalPanel() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  async function fetchLeaveRequests() {
    const { data } = await supabase
      .from('leave_requests')
      .select('*, users(name, employee_id)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    setLeaveRequests(data || [])
    setLoading(false)
  }

  async function handleApprove(id: string) {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'approved' })
      .eq('id', id)

    if (!error) {
      await fetchLeaveRequests()
    }
  }

  async function handleReject(id: string) {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (!error) {
      await fetchLeaveRequests()
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Leave Approvals</h2>
      </div>
      <div className="divide-y">
        {leaveRequests.length > 0 ? (
          leaveRequests.map((req: any) => (
            <div key={req.id} className="p-4 hover:bg-gray-50">
              <p className="font-medium text-gray-900">
                {req.users?.name} ({req.users?.employee_id})
              </p>
              <p className="text-sm text-gray-600">
                {new Date(req.from_date).toLocaleDateString()} -{' '}
                {new Date(req.to_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="capitalize font-medium">{req.type}</span> Leave
              </p>
              {req.remarks && (
                <p className="text-sm text-gray-500 mt-1">Remarks: {req.remarks}</p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(req.id)}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500 text-sm">No pending leave requests</p>
        )}
      </div>
    </div>
  )
}
