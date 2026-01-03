import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        url: supabaseUrl ? '✓ Configured' : '✗ Missing',
        key: supabaseAnonKey ? '✓ Configured' : '✗ Missing',
      },
      connection: null,
      tables: null,
      error: null,
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      diagnostics.error = 'Missing Supabase configuration'
      return NextResponse.json(diagnostics, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test 1: Check database connection by fetching from users table
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true })

      if (error) {
        diagnostics.connection = {
          status: 'error',
          code: error.code,
          message: error.message,
          details: error.details,
        }
      } else {
        diagnostics.connection = {
          status: 'connected',
          message: 'Successfully queried users table',
          count: data?.length || 0,
        }
      }
    } catch (err) {
      diagnostics.connection = {
        status: 'error',
        message: String(err),
      }
    }

    // Test 2: Check table existence
    try {
      const tableNames = ['users', 'companies', 'attendance', 'leave_requests']
      const tableStatus: any = {}

      for (const tableName of tableNames) {
        try {
          const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true })
          tableStatus[tableName] = error ? 'error' : 'exists'
        } catch (err) {
          tableStatus[tableName] = 'error'
        }
      }

      diagnostics.tables = tableStatus
    } catch (err) {
      diagnostics.tables = { error: String(err) }
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: `Server error: ${error instanceof Error ? error.message : 'Unknown'}`,
      },
      { status: 500 }
    )
  }
}
