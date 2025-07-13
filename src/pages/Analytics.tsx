import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsSkeleton = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
        </div>
    </div>
)

export function Analytics() {
    const { briefs, stats, loading } = useDashboard();

    if(loading) return <AnalyticsSkeleton />;

    // Calculate additional analytics from live data
    const briefsLast30Days = briefs.filter(b => new Date(b.created_at) > subDays(new Date(), 30));

    const briefsByDay = briefsLast30Days.reduce((acc, brief) => {
        const day = format(new Date(brief.created_at), 'MMM dd');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(briefsByDay).map(([name, value]) => ({ name, briefs: value })).reverse();

    const templateDistribution = briefs.reduce((acc, brief) => {
        const templateName = brief.template_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const existing = acc.find(item => item.name === templateName);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: templateName, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Analytics Dashboard</h1>
                <p className="text-md text-gray-500 dark:text-gray-400">Your content creation at a glance.</p>
            </header>

            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Briefs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalBriefs}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">All-time generated briefs</p>
                    </CardContent>
                </Card>
                 <Card className="dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Last 30 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{briefsLast30Days.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Briefs created recently</p>
                    </CardContent>
                </Card>
                <Card className="dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.mostUsedTemplate}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Most used template type</p>
                    </CardContent>
                </Card>
                 <Card className="dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Word Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.avgWordCount}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Average words per brief</p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-3 dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle>Briefs Created (Last 30 Days)</CardTitle>
                        <CardDescription>A day-by-day look at your content creation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(25, 25, 25, 0.8)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                    cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                                />
                                <Bar dataKey="briefs" fill="#0088FE" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle>Template Distribution</CardTitle>
                        <CardDescription>How you categorize your briefs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={templateDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {templateDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                     contentStyle={{
                                        backgroundColor: 'rgba(25, 25, 25, 0.8)',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}