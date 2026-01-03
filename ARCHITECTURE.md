# Architecture Overview - Dayflow HRMS

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER / CLIENT                 │
│  (Next.js 14 App Router + React Components)         │
└─────────────────────────────────────────────────────┘
                          ↕
                    (HTTPS / SSL)
                          ↕
┌─────────────────────────────────────────────────────┐
│                 NEXT.JS BACKEND                      │
│  (Server Components, Server Actions, API Routes)    │
└─────────────────────────────────────────────────────┘
                          ↕
                  (Supabase Client)
                          ↕
┌─────────────────────────────────────────────────────┐
│                  SUPABASE BACKEND                    │
│  ┌──────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                  │  │
│  │  - users                                     │  │
│  │  - attendance                                │  │
│  │  - leave_requests                           │  │
│  │  (with RLS policies)                        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │    Authentication (Supabase Auth)            │  │
│  │  - JWT tokens                                │  │
│  │  - Session management                       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↕
                   (Deployed on Vercel)
                          ↕
                    (Users access)
```

---

## Technology Stack Detail

### Frontend Layer

**Framework:** Next.js 14 (App Router)
- Server Components for optimal performance
- Automatic code splitting
- Built-in image optimization

**Styling:** Tailwind CSS v4
- Utility-first CSS
- Production-optimized bundle
- Responsive design included

**Client State:** React Hooks
- `useState` for component state
- `useEffect` for side effects
- `useContext` for app-wide state (future)

**Type Safety:** TypeScript
- Full type coverage
- Strict mode enabled
- Better IDE support

### Backend Layer

**Next.js Server Functions:**
- Server Actions (React Server Components)
- API Routes (for future REST endpoints)
- Built-in authentication handling

**Supabase:**
- BaaS (Backend as a Service)
- PostgreSQL database
- JWT-based authentication
- Real-time subscriptions (future feature)

### Database Layer

**PostgreSQL (Supabase)**
- Fully managed & secure
- Automatic backups
- Built-in Row Level Security (RLS)
- Indexes for performance
- Foreign key constraints

### Authentication

**Supabase Auth:**
- JWT tokens stored in session
- Email verification support
- OAuth-ready architecture
- Automatic session management

### Hosting

**Vercel:**
- Optimized for Next.js
- Auto-scaling
- Global CDN
- Automatic HTTPS

---

## Data Flow Architecture

### Authentication Flow

```
User Registration
├── User fills form
├── Submit to /auth/register
├── Supabase creates auth user
├── App creates user profile in DB
└── Redirect to login

User Login
├── User enters credentials
├── Supabase validates & returns JWT
├── App stores JWT in session
├── App fetches user role
├── Router redirects based on role
└── Dashboard loads with user data

User Logout
├── User clicks logout
├── Supabase clears session
├── App redirects to home
└── Dashboard no longer accessible
```

### Attendance Flow

```
Employee Check-in
├── Employee clicks "Check In"
├── Frontend captures timestamp
├── Sends to Supabase
├── RLS policy validates ownership
├── Database inserts record
├── Frontend updates UI
└── Status shows "Present"

HR Views Attendance
├── HR selects employee
├── Frontend queries Supabase
├── RLS policy validates HR role
├── Database returns all records
├── Frontend displays table
└── HR can update if needed
```

### Leave Request Flow

```
Employee Applies for Leave
├── Employee fills form (dates, type, remarks)
├── Submits to Supabase
├── RLS validates user_id
├── Database creates record with status=pending
├── Frontend shows "Pending"
└── Confirmation displayed

HR Reviews Leave
├── HR dashboard loads pending requests
├── HR sees employee name, dates, type
├── HR clicks Approve/Reject
├── Supabase updates status
├── RLS validates HR role
├── Employee sees updated status
└── Request processing complete
```

---

## Security Architecture

### Row Level Security (RLS)

```
Database Level
├── users table
│   ├── Employees can only see own profile
│   └── HR can see all profiles
├── attendance table
│   ├── Employees can only access own records
│   ├── Can insert/update own records only
│   └── HR can access all records
└── leave_requests table
    ├── Employees can only apply for themselves
    ├── HR can approve/reject any request
    └── Both can view relevant records
```

### Authentication Security

✅ **JWT Tokens**
- Signed by Supabase
- Expires automatically
- Stored in secure HTTP-only cookies (Vercel)

✅ **Session Management**
- Automatic session refresh
- Cross-tab session sync
- Logout clears session

✅ **Password Security**
- Hashed with bcrypt (Supabase)
- Never sent to frontend
- HTTPS only

### API Security

✅ **CORS Protection**
- Restricted to your domain
- Prevents unauthorized requests

✅ **Rate Limiting**
- Built into Supabase
- Prevents abuse

✅ **Input Validation**
- TypeScript type checking
- Supabase constraints

---

## Scalability Architecture

### Current Capacity (Free Tier)

| Component | Capacity |
|-----------|----------|
| Vercel bandwidth | 6 GB/month |
| Supabase storage | 2 GB |
| Active users | 50,000 MAU |
| Connections | 100 concurrent |

### Scaling Path

**Phase 1: 100 employees**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Total: ~$50/month

**Phase 2: 1000 employees**
- Vercel Enterprise (custom)
- Supabase Plus (custom)
- Add caching layer (Redis)
- Add analytics (PostHog/Mixpanel)

**Phase 3: 10000+ employees**
- Multi-region setup
- Database replication
- Dedicated infrastructure
- Custom SLA agreements

---

## Component Architecture

### Page Components (App Router)

```typescript
app/dashboard/employee/page.tsx
├── useEffect → Check auth
├── useState → Store user data
├── Fetch user & leave requests
├── Render components
└── Handle logout
```

**Pattern:** Server Components + Client Components
- Layout = Server Component
- Dashboard = Client Component (auth check)
- Cards = Client Components (state)

### Reusable Components

**ProfileCard**
```
Props: User | null
Displays: Name, ID, Email, Phone, Address
State: None (read-only)
```

**AttendanceCard**
```
Props: userId
State: checkedIn, todayAttendance, loading
Actions: handleCheckIn(), handleCheckOut()
```

**LeaveCard**
```
Props: userId, leaveRequests[], onRefresh()
State: showForm, loading, formData
Actions: handleChange(), handleSubmit()
```

---

## Database Schema Architecture

### Entity Relationship Diagram

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │──────┬──────────────┐
│ name        │      │              │
│ email       │      │              │
│ role        │      │              │
│ salary      │      │              │
└─────────────┘      │              │
                     │              │
        ┌────────────▼──┐   ┌──────▼──────────┐
        │ attendance    │   │ leave_requests  │
        ├───────────────┤   ├─────────────────┤
        │ id (PK)       │   │ id (PK)         │
        │ user_id (FK)  │   │ user_id (FK)    │
        │ date          │   │ from_date       │
        │ check_in      │   │ to_date         │
        │ check_out     │   │ type            │
        │ status        │   │ status          │
        └───────────────┘   │ remarks         │
                            └─────────────────┘
```

### Key Design Decisions

1. **No ORM** - Direct Supabase client for simplicity
2. **Type Safety** - TypeScript interfaces match DB
3. **RLS Over Backend Logic** - Security at DB level
4. **Normalization** - Proper foreign keys and constraints
5. **Timestamps** - Automatic audit trail

---

## State Management Architecture

### Current (Simple State)

**Per-Component State:**
```typescript
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
```

**Global State (auth):**
- Supabase Auth session (automatic)
- User role derived on login

### Future Enhancement (Context API)

```typescript
// Optional: App-wide state
const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  
  return (
    <AppContext.Provider value={{ user, role }}>
      {children}
    </AppContext.Provider>
  )
}
```

---

## Error Handling Architecture

### Current Pattern

```typescript
try {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    setError(error.message)
    return
  }
  // Success handling
} catch (err) {
  setError('An unexpected error occurred')
}
```

### Future: Error Boundary

```typescript
export function ErrorBoundary({ children }) {
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const handler = (event) => setError(event.error)
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])
  
  if (error) {
    return <ErrorPage error={error} />
  }
  
  return children
}
```

---

## Performance Optimization

### Current Optimizations

✅ Static site generation (SSG)
✅ Automatic code splitting
✅ Image optimization
✅ CSS minification
✅ Database indexes
✅ Efficient queries (select specific columns)

### Query Optimization

**Good:**
```typescript
const { data } = await supabase
  .from('users')
  .select('id, name, email')  // Only needed columns
  .eq('role', 'employee')
  .limit(10)
```

**Avoid:**
```typescript
const { data } = await supabase
  .from('users')
  .select('*')  // All columns
  .limit(1000)  // No limit
```

---

## Testing Architecture (Future)

### Unit Tests
- Jest + React Testing Library
- Test components in isolation

### Integration Tests
- Test component + Supabase interaction
- Mock Supabase responses

### E2E Tests
- Playwright / Cypress
- Test full user flows
- Login → Dashboard → Logout

---

## DevOps Architecture

### Development
```
Local Development
├── npm run dev
├── Hot reload on save
├── .env.local for credentials
└── Console logs for debugging
```

### Staging (Future)
```
Preview Deployments
├── Created on every PR
├── Tests run automatically
├── Can be shared for review
└── Auto-deleted after merge
```

### Production
```
Main Branch Deployment
├── Automated on git push
├── Build checks pass first
├── Zero-downtime deployment
├── Automatic rollback if fail
└── Performance monitored
```

---

## Monitoring Architecture

### What We Monitor

**Application Metrics:**
- Page load time
- API response time
- Error rate
- User sessions

**Database Metrics:**
- Query execution time
- Connection pool usage
- Storage usage
- Row count growth

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Network latency
- Availability uptime

### Tools

- **Vercel** - Deployment & Web Analytics
- **Supabase** - Database logs & metrics
- **Browser DevTools** - Client-side debugging
- **Console** - Server-side logging

---

## Disaster Recovery

### Backup Strategy

1. **Code Backups** → GitHub (free)
2. **Database Backups** → Supabase automatic
3. **Manual Exports** → Monthly SQL dumps
4. **Environment Configs** → Vercel secrets backup

### Recovery Procedures

**Code Corruption:**
```bash
git revert <commit-hash>
git push origin main
# Auto-deployed to production
```

**Database Corruption:**
```
Supabase Dashboard
├── Settings → Backups
├── Select restore point
├── Click "Restore"
└── Verify before production
```

**Complete Disaster:**
```
1. Create new Supabase project
2. Restore from backup
3. Update Vercel env vars
4. Redeploy
5. Verify all systems working
6. Notify users if needed
```

---

## Security Auditing

### Regular Checks

- [ ] Review RLS policies monthly
- [ ] Audit user access logs
- [ ] Check dependency vulnerabilities
- [ ] Rotate API keys quarterly
- [ ] Review Vercel audit logs
- [ ] Update Next.js/dependencies
- [ ] Test backup restoration

### Compliance (if needed)

- GDPR: Data export/deletion features
- SOC2: Access control & monitoring
- ISO27001: Information security

---

**Architecture designed for hackathon MVP + easy scaling! 🏗️**
