'use client';

import { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Building,
  Key,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const isAdmin = user?.role === 'ADMIN';
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    leaveApprovals: true,
    attendanceReminders: true,
    payslipGenerated: true,
    systemAnnouncements: true,
    pushNotifications: false,
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    // API call would go here
    toast.success('Password updated successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationSave = () => {
    toast.success('Notification preferences saved');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="account" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-4 h-auto">
            <TabsTrigger value="account" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={user?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground">
                      Contact admin to change email
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          user?.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : user?.role === 'HR'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }
                      >
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={user?.employee?.firstName || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={user?.employee?.lastName || ''} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={user?.employee?.department?.departmentName || 'Not Assigned'}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input
                      value={user?.employee?.designation?.designationName || 'Not Assigned'}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" asChild>
                    <a href="/profile">Edit Profile</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Login Sessions
                </CardTitle>
                <CardDescription>
                  Manage your active sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Web Browser • Active Now
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Choose what emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Leave Approvals</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your leave is approved or rejected
                    </p>
                  </div>
                  <Switch
                    checked={notifications.leaveApprovals}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, leaveApprovals: checked })
                    }
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Attendance Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Daily reminders to check in and check out
                    </p>
                  </div>
                  <Switch
                    checked={notifications.attendanceReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        attendanceReminders: checked,
                      })
                    }
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payslip Generated</p>
                    <p className="text-sm text-muted-foreground">
                      Notification when your monthly payslip is ready
                    </p>
                  </div>
                  <Switch
                    checked={notifications.payslipGenerated}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, payslipGenerated: checked })
                    }
                  />
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Announcements</p>
                    <p className="text-sm text-muted-foreground">
                      Important updates and company announcements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemAnnouncements}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        systemAnnouncements: checked,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNotificationSave}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize how Dayflow looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-20 rounded-md bg-white border mb-3 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-100 rounded" />
                    </div>
                    <p className="font-medium text-center">Light</p>
                  </div>
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-20 rounded-md bg-gray-900 border border-gray-700 mb-3 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-800 rounded" />
                    </div>
                    <p className="font-medium text-center">Dark</p>
                  </div>
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      theme === 'system'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="h-20 rounded-md border mb-3 flex overflow-hidden">
                      <div className="w-1/2 bg-white flex items-center justify-center">
                        <div className="w-5 h-5 bg-gray-100 rounded" />
                      </div>
                      <div className="w-1/2 bg-gray-900 flex items-center justify-center">
                        <div className="w-5 h-5 bg-gray-800 rounded" />
                      </div>
                    </div>
                    <p className="font-medium text-center">System</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Set your preferred language and date format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Admin-only Company Settings */}
      {isAdmin && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Settings
              </CardTitle>
              <CardDescription>
                Configure organization-wide settings (Admin only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Dayflow Technologies" />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Hours</Label>
                    <Select defaultValue="9-6">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-5">9 AM - 5 PM</SelectItem>
                        <SelectItem value="9-6">9 AM - 6 PM</SelectItem>
                        <SelectItem value="10-7">10 AM - 7 PM</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Company Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
