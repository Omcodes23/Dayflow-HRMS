'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Attendance } from '@/types'

interface AttendanceCardProps {
  userId: string
}

export function AttendanceCard({ userId }: AttendanceCardProps) {
  const [checkedIn, setCheckedIn] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTodayAttendance()
  }, [userId])

  async function fetchTodayAttendance() {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (data) {
      setTodayAttendance(data)
      setCheckedIn(!!data.check_in)
    }
  }

  async function handleCheckIn() {
    setLoading(true)
    const now = new Date().toISOString()
    const today = new Date().toISOString().split('T')[0]

    if (!todayAttendance) {
      const { error } = await supabase.from('attendance').insert({
        user_id: userId,
        date: today,
        check_in: now,
        status: 'present',
      })

      if (!error) {
        setCheckedIn(true)
        await fetchTodayAttendance()
      }
    }
    setLoading(false)
  }

  async function handleCheckOut() {
    setLoading(true)
    const now = new Date().toISOString()

    if (todayAttendance) {
      const { error } = await supabase
        .from('attendance')
        .update({ check_out: now })
        .eq('id', todayAttendance.id)

      if (!error) {
        await fetchTodayAttendance()
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Attendance</h2>
      <div className="space-y-4">
        {todayAttendance && (
          <>
            <p className="text-gray-700">
              <span className="font-medium">Check In:</span>{' '}
              {todayAttendance.check_in
                ? new Date(todayAttendance.check_in).toLocaleTimeString()
                : 'Not checked in'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Check Out:</span>{' '}
              {todayAttendance.check_out
                ? new Date(todayAttendance.check_out).toLocaleTimeString()
                : 'Not checked out'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{todayAttendance.status}</span>
            </p>
          </>
        )}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleCheckIn}
            disabled={checkedIn || loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!checkedIn || !!todayAttendance?.check_out || loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  )
}
