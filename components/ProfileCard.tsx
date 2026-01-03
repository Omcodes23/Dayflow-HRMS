'use client'

import { User } from '@/types'

interface ProfileCardProps {
  user: User | null
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      {user ? (
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Employee ID:</span> {user.employee_id}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Address:</span> {user.address}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  )
}
