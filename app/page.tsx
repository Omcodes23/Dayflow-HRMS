'use client'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Dayflow</h1>
          <p className="text-xl text-muted-foreground">Human Resource Management System</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/auth/login">Sign In</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/auth/register">Sign Up</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
