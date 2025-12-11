import Header from '@/components/layout/Header';
import TaskCard from '@/components/dashboard/TaskCard';
import { useEmailStore } from '@/hooks/useEmailStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Tasks = () => {
  const { tasks } = useEmailStore();
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen">
      <Header 
        title="Task Timeline" 
        subtitle={`${pendingTasks.length} pending tasks, ${urgentTasks.length} urgent`}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 animate-slide-up opacity-0 stagger-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/15">
                <CheckSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 animate-slide-up opacity-0 stagger-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-urgent/15">
                <AlertTriangle className="w-5 h-5 text-urgent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{urgentTasks.length}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 animate-slide-up opacity-0 stagger-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/15">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 animate-slide-up opacity-0 stagger-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/15">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {tasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            {urgentTasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No completed tasks yet</p>
              </div>
            ) : (
              completedTasks.map((task, index) => (
                <div 
                  key={task.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TaskCard task={task} />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tasks;
