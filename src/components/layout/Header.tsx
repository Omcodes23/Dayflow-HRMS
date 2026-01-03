'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearAuth();
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      router.push('/signin');
      toast.success('Logged out successfully');
    },
    onError: () => {
      clearAuth();
      router.push('/signin');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const initials = user?.employee
    ? `${user.employee.firstName?.[0] || ''}${user.employee.lastName?.[0] || ''}`
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b bg-background px-3 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
            Welcome back, {user?.employee?.firstName || 'User'}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1 sm:px-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.employee?.firstName} {user?.employee?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
