import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { SaveDiagnostic } from '@/components/test/SaveDiagnostic';
import { 
  User, 
  Settings as SettingsIcon, 
  CreditCard, 
  FileText, 
  Clock,
  Shield,
  TestTube
} from 'lucide-react';

export function Settings() {
  const { user, signOut } = useAuth();
  const { userProfile, stats } = useDashboard();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium':
        return 'bg-gold-100 text-gold-800 border-gold-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Account Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{user?.email || 'Not available'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-sm font-mono text-xs">{user?.id || 'Not available'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                <p className="text-sm">{userProfile?.display_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-sm">
                  {userProfile?.created_at 
                    ? new Date(userProfile.created_at).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Subscription & Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.subscription_tier || 'free'} plan
                </p>
              </div>
              <Badge className={getSubscriptionBadgeColor(userProfile?.subscription_tier || 'free')}>
                {(userProfile?.subscription_tier || 'free').toUpperCase()}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.totalBriefs}</p>
                <p className="text-sm text-muted-foreground">Total Briefs</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{userProfile?.briefs_count || 0}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">
                  {userProfile?.briefs_limit === -1 ? '∞' : userProfile?.briefs_limit || 10}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Limit</p>
              </div>
            </div>

            {userProfile && userProfile.briefs_limit !== -1 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Usage</span>
                  <span>{userProfile.briefs_count}/{userProfile.briefs_limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((userProfile.briefs_count / userProfile.briefs_limit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagnostic Tools */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <CardTitle>Diagnostic Tools</CardTitle>
            </div>
            <CardDescription className="ml-auto">
              Test and troubleshoot functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaveDiagnostic />
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>Account Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;