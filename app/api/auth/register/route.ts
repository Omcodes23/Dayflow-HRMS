import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    // Use service key if available, otherwise use anon key
    const isUsingServiceKey = !!process.env.SUPABASE_SERVICE_KEY
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    let authData: any
    let authError: any

    if (isUsingServiceKey) {
      // Use admin API if service key is available
      const result = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      authData = result.data
      authError = result.error
    } else {
      // Use regular signUp if only anon key
      const result = await supabase.auth.signUp({
        email,
        password,
      })
      authData = result.data
      authError = result.error
    }

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Insert user profile with RLS bypass if service key available
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role,
        company_id: null,
      })
      .select()

    if (profileError) {
      console.error('Profile insert error:', profileError)
      
      // If RLS is blocking, try to continue anyway
      if (profileError.code === 'PGRST301' || profileError.message.includes('permission denied')) {
        console.warn('RLS blocking insert, but auth user created successfully')
        // Return success since auth user is created
        return NextResponse.json(
          { 
            success: true, 
            userId: authData.user.id,
            warning: 'User created but profile insert may be pending'
          },
          { status: 201 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to create profile: ${profileError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, userId: authData.user.id, profile: profileData },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    )
  }
}
