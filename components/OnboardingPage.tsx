'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CompanyCreationModal } from '@/components/CompanyCreationModal'
import type { Database } from '@/types/supabase'

type Company = Database['public']['Tables']['companies']['Row']

interface OnboardingPageProps {
  userId?: string
}

export function OnboardingPage({ userId: _userId }: OnboardingPageProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    async function initializeUser() {
      try {
        // Get current user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/login')
          return
        }

        setUser(authUser)

        // Fetch user's companies
        const { data: userCompanies } = await supabase
          .from('companies')
          .select('*')
          .or(`owner_id.eq.${authUser.id},employees.contains.${JSON.stringify([authUser.id])}`)

        setCompanies(userCompanies || [])

        // If user has no companies, show create modal
        if (!userCompanies || userCompanies.length === 0) {
          setShowCreateModal(true)
        }
      } catch (error) {
        console.error('Failed to initialize user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [router])

  async function selectCompany(companyId: string) {
    sessionStorage.setItem('company_id', companyId)
    router.push('/dashboard/employee')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Dayflow
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Select a company to access your dashboard or create a new one
          </p>
        </div>

        {companies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Companies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company: Company) => (
                <div
                  key={company.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => selectCompany(company.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {company.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{company.email}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{company.industry}</span>
                    <span>{company.employees_count} employees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition inline-block"
          >
            Create New Company
          </button>
        </div>
      </div>

      {user && (
        <CompanyCreationModal
          userId={user.id}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCompanyCreated={() => {
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}
