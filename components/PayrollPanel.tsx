'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

interface PayrollPanelProps {
  employeeId: string
}

export function PayrollPanel({ employeeId }: PayrollPanelProps) {
  const [employee, setEmployee] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployee()
  }, [employeeId])

  async function fetchEmployee() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', employeeId)
      .single()

    setEmployee(data as User)
    setLoading(false)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!employee) return <p className="text-gray-500">Employee not found</p>

  const monthlyBaseSalary = employee.salary
  const basicSalary = monthlyBaseSalary * 0.6
  const hra = monthlyBaseSalary * 0.2
  const dearness = monthlyBaseSalary * 0.1
  const deductions = monthlyBaseSalary * 0.08

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Payroll Details</h2>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-700">Basic Salary</span>
          <span className="font-medium">₹{basicSalary.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-700">HRA</span>
          <span className="font-medium">₹{hra.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-700">Dearness Allowance</span>
          <span className="font-medium">₹{dearness.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-red-300">
          <span className="text-gray-700">Deductions</span>
          <span className="font-medium text-red-600">-₹{deductions.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3 bg-blue-50 px-3 rounded">
          <span className="font-semibold text-gray-900">Net Salary</span>
          <span className="font-bold text-blue-600 text-lg">
            ₹{(monthlyBaseSalary - deductions).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
