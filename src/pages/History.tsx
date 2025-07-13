import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Users, 
  Target, 
  Search, 
  Filter,
  Trash2,
  Eye,
  Download,
  Calendar,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const getTemplateInfo = (templateType: string) => {
  switch (templateType) {
    case 'meeting_summary':
      return { icon: <Users className="h-4 w-4 text-blue-500" />, label: 'Meeting Summary', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    case 'client_update':
      return { icon: <FileText className="h-4 w-4 text-green-500" />, label: 'Client Update', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    case 'action_plan':
      return { icon: <Target className="h-4 w-4 text-purple-500" />, label: 'Action Plan', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
    default:
      return { icon: <FileText className="h-4 w-4 text-gray-500" />, label: 'Brief', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
  }
};

const HistorySkeleton = () => (
  <div className="p-4 sm:p-6 md:p-8 space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-80" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-48" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  </div>
);

export function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { briefs, loading, refreshData } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBriefs = briefs.filter(brief => {
    const matchesSearch = brief.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brief.input_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate = templateFilter === 'all' || brief.template_type === templateFilter;
    return matchesSearch && matchesTemplate;
  });

  const handleDeleteBrief = async (briefId: string) => {
    setDeletingId(briefId);
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefId);

      if (error) throw error;

      toast({
        title: "Brief Deleted",
        description: "The brief has been successfully deleted.",
      });

      // Refresh dashboard data to sync all components
      await refreshData();
    } catch (error) {
      console.error('Error deleting brief:', error);
      toast({
        title: "Error",
        description: "Failed to delete brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const downloadBrief = (brief: any) => {
    const blob = new Blob([brief.output_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brief.title.replace(/\s+/g, '_')}_${brief.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Brief History</h1>
        <p className="text-md text-gray-500 dark:text-gray-400">Manage and review all your generated briefs.</p>
      </header>

      <section className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search briefs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="meeting_summary">Meeting Summary</SelectItem>
            <SelectItem value="client_update">Client Update</SelectItem>
            <SelectItem value="action_plan">Action Plan</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section>
        {filteredBriefs.length === 0 ? (
          <Card className="text-center py-12 dark:bg-gray-800/80">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {searchTerm || templateFilter !== 'all' ? 'No matching briefs found' : 'No briefs yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || templateFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Create your first brief to get started.'}
              </p>
              {(!searchTerm && templateFilter === 'all') && (
                <Button onClick={() => navigate('/app/upload')}>
                  Create Your First Brief
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBriefs.map((brief) => {
              const { icon, label, color } = getTemplateInfo(brief.template_type);
              return (
                <Card key={brief.id} className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800/80">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            {icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                              {brief.title}
                            </h3>
                            <Badge variant="outline" className={`${color} border-none`}>
                              {label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {brief.output_text.substring(0, 200)}...
                        </p>
                        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(brief.created_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(brief.created_at), { addSuffix: true })}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {brief.metadata?.wordCount || 0} words
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/app/briefs/${brief.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadBrief(brief)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Brief</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{brief.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBrief(brief.id)}
                                disabled={deletingId === brief.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deletingId === brief.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}