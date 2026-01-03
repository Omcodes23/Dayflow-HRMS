'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

interface EmployeeListProps {
  onSelectEmployee: (employee: User) => void
  selectedId?: string
}

export function EmployeeList({ onSelectEmployee, selectedId }: EmployeeListProps) {
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employee')

    setEmployees(data || [])
    setLoading(false)
  }

  if (loading) return <p className="text-gray-500">Loading employees...</p>

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Employees</h2>
      </div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => onSelectEmployee(emp)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition ${
              selectedId === emp.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <p className="font-medium text-gray-900">{emp.name}</p>
            <p className="text-sm text-gray-500">{emp.employee_id}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
