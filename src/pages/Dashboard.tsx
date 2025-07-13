import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  Users, 
  Target, 
  ArrowRight,
  TrendingUp,
  Zap,
  Star,
  PlusCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import { UsageTracker } from '@/components/dashboard/UsageTracker';
import { Skeleton } from '@/components/ui/skeleton';

const getTemplateInfo = (templateType: string) => {
  switch (templateType) {
    case 'meeting_summary':
      return { icon: <Users className="h-4 w-4 text-blue-500" />, label: 'Meeting Summary', color: 'bg-blue-100 text-blue-800' };
    case 'client_update':
      return { icon: <FileText className="h-4 w-4 text-green-500" />, label: 'Client Update', color: 'bg-green-100 text-green-800' };
    case 'action_plan':
      return { icon: <Target className="h-4 w-4 text-purple-500" />, label: 'Action Plan', color: 'bg-purple-100 text-purple-800' };
    default:
      return { icon: <FileText className="h-4 w-4 text-gray-500" />, label: 'Brief', color: 'bg-gray-100 text-gray-800' };
  }
};

const DashboardSkeleton = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-11 w-48" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>

    <div>
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export function Dashboard() {
  const navigate = useNavigate();
  const { briefs, userProfile, stats, loading } = useDashboard();

  const displayName = userProfile?.display_name || userProfile?.email?.split('@')[0] || 'User';

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (briefs.length === 0) {
    return <EmptyDashboard userDisplayName={displayName} />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {displayName}!</h1>
          <p className="text-md text-gray-500 dark:text-gray-400">Here's your productivity snapshot.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/app/upload')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Brief
        </Button>
      </header>
      
      <main className="space-y-8">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Briefs</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalBriefs}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.thisMonth > 0 ? `+${stats.thisMonth} this month` : 'No new briefs this month'}
                </p>
              </CardContent>
            </Card>
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used Template</CardTitle>
                <Star className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.mostUsedTemplate}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.templatesUsed} total template types used
                </p>
              </CardContent>
            </Card>
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Word Count</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.avgWordCount}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Average words per brief
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <UsageTracker />

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recent Briefs</h2>
            <Button variant="ghost" onClick={() => navigate('/app/history')} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map(brief => {
              const { icon, label, color } = getTemplateInfo(brief.template_type);
              return (
                <Card key={brief.id} onClick={() => navigate(`/app/briefs/${brief.id}`)} className="group cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-md dark:bg-gray-800/80 dark:hover:border-blue-400">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        {icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">{brief.title}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Badge variant="outline" className={`border-none ${color}`}>{label}</Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(brief.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}