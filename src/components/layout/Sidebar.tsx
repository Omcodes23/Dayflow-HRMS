'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  IndianRupee,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const employeeNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/attendance', label: 'Attendance', icon: Clock },
  { href: '/leaves', label: 'Leaves', icon: CalendarDays },
  { href: '/payroll', label: 'Payroll', icon: IndianRupee },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/leaves', label: 'Leave Approvals', icon: ClipboardCheck },
  { href: '/admin/attendance', label: 'Attendance Report', icon: FileText },
  { href: '/admin/payroll', label: 'Payroll Management', icon: IndianRupee },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                D
              </div>
              <span className="text-xl font-bold text-foreground">Dayflow</span>
            </Link>
          )}
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {/* Employee section */}
          {!collapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Menu</p>
          )}
          {employeeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              {!collapsed && (
                <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase">
                  Administration
                </p>
              )}
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose?.()}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User info */}
        {!collapsed && user && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium">
                {user.employee?.firstName?.[0]}
                {user.employee?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.employee?.firstName} {user.employee?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
