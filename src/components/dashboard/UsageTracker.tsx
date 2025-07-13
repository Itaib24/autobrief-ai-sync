import { Link } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Star, Zap } from 'lucide-react';

export function UsageTracker() {
  const { userProfile, stats } = useDashboard();

  if (!userProfile) {
    return null; 
  }

  const { subscription_tier, briefs_limit } = userProfile;
  const briefsCount = stats.totalBriefs;

  const usagePercentage = briefs_limit > 0 ? (briefsCount / briefs_limit) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;
  const hasExceededLimit = briefs_limit > 0 && briefsCount >= briefs_limit;

  const tierName = subscription_tier.charAt(0).toUpperCase() + subscription_tier.slice(1);

  return (
    <Card className={`transform transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800/80 ${isNearLimit && !hasExceededLimit ? 'border-yellow-500/50' : ''} ${hasExceededLimit ? 'border-red-500/50' : ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="font-semibold text-gray-800 dark:text-gray-100">Usage this Month</span>
          <Badge 
            variant={subscription_tier === 'free' ? 'outline' : 'default'}
            className={subscription_tier === 'free' ? 'border-gray-300 dark:border-gray-600' : 'bg-green-600 text-white'}
          >
            <Star className="mr-1.5 h-3 w-3" />
            {tierName} Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Briefs Generated</span>
            <span className="font-bold text-gray-800 dark:text-gray-100">
              {briefsCount}
              {briefs_limit > 0 && <span className="text-sm font-normal text-gray-500"> / {briefs_limit}</span>}
            </span>
          </div>
          {briefs_limit > 0 ? (
            <Progress value={usagePercentage} />
          ) : (
            <p className="text-sm text-green-600 dark:text-green-400 text-center pt-2">You have unlimited briefs!</p>
          )}
        </div>

        {(isNearLimit || hasExceededLimit) && briefs_limit > 0 && (
          <div className={`p-3 rounded-lg flex items-center gap-3 ${hasExceededLimit ? 'bg-red-50 dark:bg-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'}`}>
            <AlertTriangle className={`h-6 w-6 ${hasExceededLimit ? 'text-red-500' : 'text-yellow-500'}`} />
            <div>
              <p className={`font-semibold ${hasExceededLimit ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
                {hasExceededLimit ? 'Limit Reached' : 'Approaching Limit'}
              </p>
              <p className={`text-sm ${hasExceededLimit ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {hasExceededLimit ? 'Please upgrade your plan to generate more briefs.' : `You have used ${usagePercentage.toFixed(0)}% of your monthly briefs.`}
              </p>
            </div>
          </div>
        )}
        
        {subscription_tier === 'free' && (
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md">
            <Link to="/app/settings">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}