import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CategoryCard from '@/components/dashboard/CategoryCard';
import EmailCard from '@/components/dashboard/EmailCard';
import TaskCard from '@/components/dashboard/TaskCard';
import { useEmailStore } from '@/hooks/useEmailStore';
import { EmailCategory, CategoryCount } from '@/types';
import { Mail, Clock, Filter, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories: EmailCategory[] = ['government', 'finance', 'bills', 'healthcare', 'education', 'insurance', 'employment', 'misc'];

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') as EmailCategory | null;
  const { emails, tasks, getEmailCountByCategory } = useEmailStore();

  // Get emails with completed tasks
  const completedTaskEmailIds = tasks
    .filter(t => t.status === 'completed' && t.emailId)
    .map(t => t.emailId);

  // Separate active and completed emails
  const activeEmails = emails.filter(e => !completedTaskEmailIds.includes(e.id));
  const completedEmails = emails.filter(e => completedTaskEmailIds.includes(e.id));

  const filteredActiveEmails = selectedCategory 
    ? activeEmails.filter(e => e.category === selectedCategory)
    : activeEmails;

  const filteredCompletedEmails = selectedCategory 
    ? completedEmails.filter(e => e.category === selectedCategory)
    : completedEmails;

  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed');

  // Generate real category counts from actual emails (only active)
  const categoryCounts: CategoryCount[] = categories.map(category => {
    const categoryEmails = activeEmails.filter(e => e.category === category);
    return {
      category,
      count: categoryEmails.length,
      unread: categoryEmails.filter(e => !e.isRead).length,
    };
  });

  const handleCategoryClick = (category: EmailCategory) => {
    if (selectedCategory === category) {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Smart Inbox" 
        subtitle={`${activeEmails.filter(e => !e.isRead).length} unread emails, ${urgentTasks.length} urgent tasks`}
      />

      <div className="p-6">
        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {categoryCounts.map((cat, index) => (
            <div 
              key={cat.category}
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CategoryCard 
                data={cat}
                isSelected={selectedCategory === cat.category}
                onClick={() => handleCategoryClick(cat.category)}
              />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <TabsList>
                    <TabsTrigger value="active" className="flex items-center gap-2">
                      Active
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                        {filteredActiveEmails.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                      <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded-full">
                        {filteredCompletedEmails.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <TabsContent value="active" className="space-y-3 mt-0">
                {filteredActiveEmails.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active emails in this category</p>
                  </div>
                ) : (
                  filteredActiveEmails.map((email, index) => (
                    <div 
                      key={email.id}
                      className="animate-slide-up opacity-0"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <EmailCard email={email} />
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 mt-0">
                {filteredCompletedEmails.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No completed emails yet</p>
                    <p className="text-sm mt-2">Complete tasks to see emails here</p>
                  </div>
                ) : (
                  filteredCompletedEmails.map((email, index) => (
                    <div 
                      key={email.id}
                      className="animate-slide-up opacity-0"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative">
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </div>
                        <EmailCard email={email} />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Task Timeline Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Urgent Tasks</h2>
              </div>

              {urgentTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">All caught up!</p>
                  <p className="text-xs mt-1">No urgent tasks pending</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentTasks.map((task, index) => (
                    <div 
                      key={task.id}
                      className="animate-slide-up opacity-0"
                      style={{ animationDelay: `${(index + 3) * 0.05}s` }}
                    >
                      <TaskCard task={task} />
                    </div>
                  ))}
                </div>
              )}

              <Link to="/tasks">
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-primary hover:bg-primary/10"
                >
                  View All Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
