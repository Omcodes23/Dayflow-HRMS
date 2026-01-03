'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runDiagnostics() {
      const diagnostics: any = {
        timestamp: new Date().toISOString(),
        routes: {},
        api: {},
        supabase: {},
      }

      // Check routes
      const routes = [
        { path: '/', name: 'Home' },
        { path: '/auth/login', name: 'Login' },
        { path: '/auth/register', name: 'Register' },
        { path: '/dashboard/employee', name: 'Employee Dashboard' },
        { path: '/dashboard/hr', name: 'HR Dashboard' },
        { path: '/onboarding', name: 'Onboarding' },
      ]

      for (const route of routes) {
        try {
          const res = await fetch(route.path)
          diagnostics.routes[route.name] = {
            status: res.status,
            ok: res.ok,
          }
        } catch (err) {
          diagnostics.routes[route.name] = {
            error: String(err),
          }
        }
      }

      // Check API endpoints
      const apis = [
        { path: '/api/auth/login', name: 'Login API' },
        { path: '/api/auth/register', name: 'Register API' },
      ]

      for (const api of apis) {
        try {
          const res = await fetch(api.path, { method: 'OPTIONS' })
          diagnostics.api[api.name] = {
            status: res.status,
            exists: res.status !== 404,
          }
        } catch (err) {
          diagnostics.api[api.name] = {
            error: String(err),
          }
        }
      }

      // Check Supabase via API
      try {
        const res = await fetch('/api/diagnostics')
        const data = await res.json()
        diagnostics.supabase = data
      } catch (err) {
        diagnostics.supabase = {
          error: String(err),
        }
      }

      setResults(diagnostics)
      setLoading(false)
    }

    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Dayflow Diagnostics</h1>
          <p className="text-muted-foreground">System Health Check</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">Running diagnostics...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Routes</CardTitle>
                <CardDescription>Frontend routes accessibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(results.routes).map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{name}</span>
                    <span className={data.ok ? 'text-green-600' : 'text-red-600'}>
                      {data.ok ? '✓ OK' : data.status ? `✗ ${data.status}` : '✗ Error'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Backend API route availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(results.api).map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{name}</span>
                    <span className={data.exists ? 'text-green-600' : 'text-red-600'}>
                      {data.exists ? '✓ Exists' : '✗ Not Found'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Supabase */}
            <Card>
              <CardHeader>
                <CardTitle>Supabase Configuration</CardTitle>
                <CardDescription>Database connection status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.supabase.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{results.supabase.error}</p>
                  </div>
                )}

                {results.supabase.environment && (
                  <>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">URL</span>
                      <span>{results.supabase.environment.url}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">Anon Key</span>
                      <span>{results.supabase.environment.key}</span>
                    </div>
                  </>
                )}

                {results.supabase.connection && (
                  <div className={`p-3 rounded border ${
                    results.supabase.connection.status === 'connected'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className="font-semibold">
                      {results.supabase.connection.status === 'connected' ? '✓ Connected' : '✗ Connection Error'}
                    </p>
                    <p className="text-sm">{results.supabase.connection.message}</p>
                    {results.supabase.connection.code && (
                      <p className="text-sm text-gray-600">Code: {results.supabase.connection.code}</p>
                    )}
                  </div>
                )}

                {results.supabase.tables && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold mb-2">Tables</p>
                    {Object.entries(results.supabase.tables).map(([table, status]: [string, any]) => (
                      <div key={table} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                        <span>{table}</span>
                        <span className={status === 'exists' ? 'text-green-600' : 'text-red-600'}>
                          {status === 'exists' ? '✓ Exists' : '✗ Error'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center pt-6">
              <Button asChild>
                <a href="/">Home</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/register">Register</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/login">Login</a>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
