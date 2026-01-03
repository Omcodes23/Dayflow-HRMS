import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedData() {
  console.log('🌱 Starting data seed...\n')

  try {
    // 1. Create test users
    console.log('📝 Creating test users...')
    
    const testUsers = [
      {
        email: 'employee@test.com',
        password: 'Test@12345',
        name: 'John Employee',
        role: 'employee',
      },
      {
        email: 'hr@test.com',
        password: 'Test@12345',
        name: 'Sarah HR',
        role: 'hr',
      },
      {
        email: 'admin@test.com',
        password: 'Test@12345',
        name: 'Admin User',
        role: 'hr',
      },
    ]

    const createdUsers = []

    for (const user of testUsers) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (authError && !authError.message.includes('already exists')) {
          console.error(`  ✗ Failed to create ${user.email}:`, authError.message)
          continue
        }

        if (authData?.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              company_id: null,
            })

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error(`  ✗ Failed to create profile for ${user.email}:`, profileError.message)
          } else {
            console.log(`  ✓ Created: ${user.email} (${user.role})`)
            createdUsers.push({ id: authData.user.id, email: user.email, role: user.role })
          }
        }
      } catch (err) {
        console.error(`  ✗ Error with ${user.email}:`, err)
      }
    }

    // 2. Create test company
    console.log('\n🏢 Creating test company...')
    const { error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Acme Corporation',
        email: 'hr@acme.com',
        industry: 'Technology',
        employees_count: 50,
        owner_id: createdUsers[1]?.id || createdUsers[0]?.id, // HR user as owner
      })
      .select()

    if (companyError) {
      console.error('  ✗ Failed to create company:', companyError.message)
    } else {
      console.log('  ✓ Created: Acme Corporation')
    }

    // 3. Create sample attendance records
    console.log('\n📅 Creating sample attendance records...')
    const today = new Date()
    const attendanceRecords = []

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      for (const user of createdUsers) {
        attendanceRecords.push({
          user_id: user.id,
          date: date.toISOString().split('T')[0],
          check_in: new Date(date.setHours(9, 0, 0)).toISOString(),
          check_out: new Date(date.setHours(17, 30, 0)).toISOString(),
          status: 'present',
        })
      }
    }

    const { error: attendanceError } = await supabase.from('attendance').insert(attendanceRecords)

    if (attendanceError) {
      console.error('  ✗ Failed to create attendance:', attendanceError.message)
    } else {
      console.log(`  ✓ Created: ${attendanceRecords.length} attendance records`)
    }

    // 4. Create sample leave requests
    console.log('\n🏖️ Creating sample leave requests...')
    const leaveRequests = [
      {
        user_id: createdUsers[0]?.id,
        type: 'vacation',
        start_date: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0],
        end_date: new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString().split('T')[0],
        reason: 'Family vacation',
        status: 'pending',
      },
      {
        user_id: createdUsers[0]?.id,
        type: 'sick',
        start_date: today.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        reason: 'Flu',
        status: 'approved',
      },
    ]

    const { error: leaveError } = await supabase
      .from('leave_requests')
      .insert(leaveRequests.filter(r => r.user_id))

    if (leaveError) {
      console.error('  ✗ Failed to create leave requests:', leaveError.message)
    } else {
      console.log(`  ✓ Created: ${leaveRequests.length} leave requests`)
    }

    console.log('\n✅ Data seed completed!\n')
    console.log('📋 Test Credentials:')
    console.log('  Employee: employee@test.com / Test@12345')
    console.log('  HR:       hr@test.com / Test@12345')
    console.log('  Admin:    admin@test.com / Test@12345')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedData()
