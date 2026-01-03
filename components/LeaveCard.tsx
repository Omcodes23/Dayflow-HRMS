'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LeaveRequest } from '@/types'

interface LeaveCardProps {
  userId: string
  leaveRequests: LeaveRequest[]
  onRefresh: () => Promise<void>
}

export function LeaveCard({ userId, leaveRequests, onRefresh }: LeaveCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    type: 'paid' as const,
    remarks: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('leave_requests').insert({
      user_id: userId,
      from_date: formData.fromDate,
      to_date: formData.toDate,
      type: formData.type,
      remarks: formData.remarks,
      status: 'pending',
    })

    if (!error) {
      setFormData({ fromDate: '', toDate: '', type: 'paid', remarks: '' })
      setShowForm(false)
      await onRefresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>

      {leaveRequests.length > 0 ? (
        <div className="space-y-3 mb-4">
          {leaveRequests.slice(0, 3).map((req) => (
            <div key={req.id} className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium">
                {new Date(req.from_date).toLocaleDateString()} -{' '}
                {new Date(req.to_date).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {req.type} · {req.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">No leave requests yet</p>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Request Leave
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="paid">Paid Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
