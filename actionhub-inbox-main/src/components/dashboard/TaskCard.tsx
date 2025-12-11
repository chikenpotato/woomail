import { Link } from 'react-router-dom';
import { Task } from '@/types';
import { getCategoryConfig, formatDaysUntil } from '@/lib/categoryUtils';
import { 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  Upload, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const config = getCategoryConfig(task.category);
  const Icon = config.icon;
  const { days, label, urgency } = formatDaysUntil(task.dueDate);

  const getActionIcon = () => {
    switch (task.quickActionType?.type) {
      case 'pay': return CreditCard;
      case 'renew': return RefreshCw;
      case 'appointment': return Calendar;
      case 'upload': return Upload;
      case 'verify': return CheckCircle2;
      default: return ExternalLink;
    }
  };

  const ActionIcon = getActionIcon();

  const getActionUrl = () => {
    // Only payment types go to payment page
    if (task.quickActionType?.type === 'pay') {
      const amount = task.quickActionType.amount || 0;
      return `/payment?task=${task.id}&emailId=${task.emailId || ''}&amount=${amount}&title=${encodeURIComponent(task.title)}`;
    }
    // Appointments and other types go to email detail
    if (task.emailId) {
      return `/email/${task.emailId}`;
    }
    return '/tasks';
  };

  return (
    <div className={cn(
      "task-card",
      task.status === 'completed' && "opacity-60"
    )}>
      <div className="flex items-start gap-4">
        {/* Priority Indicator */}
        <div className={cn(
          "w-1 h-full rounded-full self-stretch",
          task.status === 'completed' && "bg-success",
          task.status !== 'completed' && task.priority === 'urgent' && "bg-urgent",
          task.status !== 'completed' && task.priority === 'high' && "bg-warning",
          task.status !== 'completed' && task.priority === 'medium' && "bg-primary",
          task.status !== 'completed' && task.priority === 'low' && "bg-muted-foreground"
        )} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-md", config.bgClass)}>
                <Icon className={cn("w-3.5 h-3.5", config.textClass)} />
              </div>
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
            <span className={cn(
              "countdown-badge",
              task.status === 'completed' && "bg-success/20 text-success",
              task.status !== 'completed' && urgency === 'urgent' && "bg-urgent/20 text-urgent",
              task.status !== 'completed' && urgency === 'warning' && "bg-warning/20 text-warning",
              task.status !== 'completed' && urgency === 'normal' && "bg-muted text-muted-foreground"
            )}>
              {task.status === 'completed' ? 'Completed' : label}
            </span>
          </div>

          <h3 className={cn(
            "font-medium mt-2",
            task.status === 'completed' ? "text-muted-foreground line-through" : "text-foreground"
          )}>{task.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>

          {/* Quick Action */}
          {task.quickActionType && task.status !== 'completed' && (
            <Link to={getActionUrl()}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary"
              >
                <ActionIcon className="w-3.5 h-3.5 mr-2" />
                {task.quickActionType.label}
                {task.quickActionType.amount && (
                  <span className="ml-1">(${task.quickActionType.amount.toFixed(2)})</span>
                )}
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          )}
          
          {task.status === 'completed' && (
            <div className="flex items-center gap-1 mt-3 text-success text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;