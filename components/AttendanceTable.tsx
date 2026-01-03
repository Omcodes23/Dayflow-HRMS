'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Attendance } from '@/types'

interface AttendanceTableProps {
  employeeId: string
}

export function AttendanceTable({ employeeId }: AttendanceTableProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [employeeId])

  async function fetchAttendance() {
    setLoading(true)
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', employeeId)
      .order('date', { ascending: false })
      .limit(10)

    setAttendance(data || [])
    setLoading(false)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Attendance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                Check In
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                Check Out
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(att.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {att.check_in
                    ? new Date(att.check_in).toLocaleTimeString()
                    : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {att.check_out
                    ? new Date(att.check_out).toLocaleTimeString()
                    : '-'}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded capitalize text-xs font-medium">
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
