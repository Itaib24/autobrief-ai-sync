import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brief } from '@/types';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  subscription_tier: string;
  briefs_count: number;
  briefs_limit: number;
}

interface BriefWithTranscript extends Brief {
  transcripts?: {
    id: string;
    original_text: string;
    source_type: string;
    user_id: string;
  };
}

interface DashboardStats {
  totalBriefs: number;
  thisMonth: number;
  templatesUsed: number;
  mostUsedTemplate: string;
  avgWordCount: number;
  recentActivity: BriefWithTranscript[];
}

interface DashboardContextType {
  briefs: BriefWithTranscript[];
  userProfile: UserProfile | null;
  stats: DashboardStats;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateBriefCount: (newCount: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState<BriefWithTranscript[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate stats from briefs data
  const calculateStats = (briefsData: BriefWithTranscript[]): DashboardStats => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBriefs = briefsData.filter(brief => {
      const briefDate = new Date(brief.created_at);
      return briefDate.getMonth() === currentMonth && briefDate.getFullYear() === currentYear;
    });

    const templateCounts = briefsData.reduce((acc, brief) => {
      acc[brief.template_type] = (acc[brief.template_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTemplate = Object.keys(templateCounts).length > 0
      ? Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

    const templateLabel = mostUsedTemplate === 'meeting_summary' ? 'Meeting Summary' :
                         mostUsedTemplate === 'client_update' ? 'Client Update' :
                         mostUsedTemplate === 'action_plan' ? 'Action Plan' : 'N/A';

    const totalWords = briefsData.reduce((acc, brief) => {
      return acc + (brief.output_text?.split(' ').length || 0);
    }, 0);

    const avgWordCount = briefsData.length > 0 ? Math.round(totalWords / briefsData.length) : 0;

    return {
      totalBriefs: briefsData.length,
      thisMonth: monthlyBriefs.length,
      templatesUsed: Object.keys(templateCounts).length,
      mostUsedTemplate: templateLabel,
      avgWordCount,
      recentActivity: briefsData.slice(0, 5)
    };
  };

  const fetchUserProfile = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  };

  const fetchBriefs = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('briefs')
      .select(`
        id,
        template,
        content_md,
        created_at,
        transcripts!inner (
          id,
          original_text,
          source_type,
          user_id
        )
      `)
      .eq('transcripts.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching briefs:', error);
      return [];
    }

    // Transform to match Brief interface
    return (data || []).map(brief => ({
      id: brief.id,
      user_id: user.id,
      title: `${brief.template.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Brief`,
      input_text: brief.transcripts?.original_text || '',
      output_text: brief.content_md || '',
      template_type: brief.template as any,
      metadata: { 
        wordCount: brief.content_md?.split(' ').length || 0 
      },
      tags: [brief.template.replace(/_/g, ' ')],
      created_at: brief.created_at,
      updated_at: brief.created_at,
      export_count: 0,
      transcripts: brief.transcripts
    }));
  };

  const refreshData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [profileData, briefsData] = await Promise.all([
        fetchUserProfile(),
        fetchBriefs()
      ]);

      setUserProfile(profileData);
      setBriefs(briefsData);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBriefCount = (newCount: number) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        briefs_count: newCount
      });
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Initial data fetch
    refreshData();

    // Subscribe to briefs changes
    const briefsSubscription = supabase
      .channel(`briefs:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'briefs'
      }, () => {
        console.log('Brief change detected, refreshing dashboard data');
        refreshData();
      })
      .subscribe();

    // Subscribe to transcript changes (which affect briefs)
    const transcriptsSubscription = supabase
      .channel(`transcripts:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transcripts',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Transcript change detected, refreshing dashboard data');
        refreshData();
      })
      .subscribe();

    // Subscribe to user profile changes
    const profileSubscription = supabase
      .channel(`user_profiles:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('User profile change detected, refreshing dashboard data');
        refreshData();
      })
      .subscribe();

    return () => {
      briefsSubscription.unsubscribe();
      transcriptsSubscription.unsubscribe();
      profileSubscription.unsubscribe();
    };
  }, [user]);

  const stats = calculateStats(briefs);

  const value: DashboardContextType = {
    briefs,
    userProfile,
    stats,
    loading,
    refreshData,
    updateBriefCount
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 