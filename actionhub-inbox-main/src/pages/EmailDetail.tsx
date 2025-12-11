import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useEmailStore } from '@/hooks/useEmailStore';
import { mockAttachments } from '@/data/mockData';
import { getCategoryConfig, formatTimeAgo, formatFileSize } from '@/lib/categoryUtils';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Paperclip, 
  Download, 
  Reply, 
  Forward, 
  Trash2,
  Star,
  Archive,
  Clock,
  ExternalLink,
  FileText,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { emails, tasks, deleteEmail, archiveEmail, starEmail, markAsRead } = useEmailStore();
  
  const email = emails.find(e => e.id === id);
  const relatedTask = tasks.find(t => t.emailId === id);
  const attachments = mockAttachments.filter(a => a.emailId === id);

  // Mark as read when viewing
  if (email && !email.isRead) {
    markAsRead(email.id);
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Email not found</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Inbox</Button>
        </div>
      </div>
    );
  }

  const config = getCategoryConfig(email.category);
  const Icon = config.icon;

  const handleDelete = () => {
    deleteEmail(email.id);
    toast({
      title: "Email Deleted",
      description: "The email has been moved to trash.",
    });
    navigate('/dashboard');
  };

  const handleArchive = () => {
    archiveEmail(email.id);
    toast({
      title: "Email Archived",
      description: "The email has been archived.",
    });
    navigate('/dashboard');
  };

  const handleStar = () => {
    starEmail(email.id);
    toast({
      title: email.isStarred ? "Star Removed" : "Email Starred",
      description: email.isStarred ? "The star has been removed." : "The email has been starred.",
    });
  };

  const handleReply = () => {
    toast({
      title: "Reply",
      description: "Reply feature coming soon!",
    });
  };

  const handleForward = () => {
    toast({
      title: "Forward",
      description: "Forward feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Email Details" 
        subtitle={email.subject}
      />

      <div className="p-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inbox
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Email Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email Header */}
            <div className="glass-card p-6 animate-slide-up opacity-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", config.bgClass)}>
                    <Icon className={cn("w-6 h-6", config.textClass)} />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground mb-1">
                      {email.subject}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{email.sender}</span>
                      <span>•</span>
                      <span>{email.senderEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(email.receivedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {relatedTask?.status === 'completed' && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  <span className={cn("category-badge", config.bgClass, config.textClass)}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleReply}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={handleForward}>
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleStar}
                  className={cn(email.isStarred && "bg-warning/10 border-warning text-warning")}
                >
                  <Star className={cn("w-4 h-4 mr-2", email.isStarred && "fill-current")} />
                  {email.isStarred ? "Starred" : "Star"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Email Body */}
            <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-muted-foreground leading-relaxed">
                  {email.preview}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Dear Sir/Madam,
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This is an automated notification regarding your account. Please review the attached documents and take the necessary action as outlined below.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  If you have any questions, please do not hesitate to contact us through our official channels.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Best regards,<br />
                  {email.sender}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Attachments ({attachments.length})</h2>
                </div>
                <div className="space-y-3">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{attachment.fileName}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.fileSize)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({ title: "Download started", description: `Downloading ${attachment.fileName}` })}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Related Task */}
            {relatedTask && (
              <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Related Task</h2>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{relatedTask.title}</p>
                    {relatedTask.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{relatedTask.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full",
                      relatedTask.status === 'completed' && "bg-success/20 text-success",
                      relatedTask.status === 'pending' && relatedTask.priority === 'urgent' && "bg-urgent/20 text-urgent",
                      relatedTask.status === 'pending' && relatedTask.priority === 'high' && "bg-warning/20 text-warning",
                      relatedTask.status === 'pending' && relatedTask.priority === 'medium' && "bg-primary/20 text-primary",
                      relatedTask.status === 'pending' && relatedTask.priority === 'low' && "bg-muted text-muted-foreground"
                    )}>
                      {relatedTask.status === 'completed' ? 'Completed' : relatedTask.priority.charAt(0).toUpperCase() + relatedTask.priority.slice(1)}
                    </span>
                    {relatedTask.status !== 'completed' && (
                      <span>Due: {relatedTask.dueDate.toLocaleDateString()}</span>
                    )}
                  </div>
                  {relatedTask.quickActionType && relatedTask.status !== 'completed' && (
                    relatedTask.quickActionType.type === 'pay' ? (
                      <Link to={`/payment?task=${relatedTask.id}&emailId=${email.id}&amount=${relatedTask.quickActionType.amount || 0}&title=${encodeURIComponent(relatedTask.title)}`}>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {relatedTask.quickActionType.label}
                          {relatedTask.quickActionType.amount && (
                            <span className="ml-1">(${relatedTask.quickActionType.amount.toFixed(2)})</span>
                          )}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => toast({ 
                          title: relatedTask.quickActionType?.label || "Action", 
                          description: "This will open the relevant service portal." 
                        })}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {relatedTask.quickActionType.label}
                      </Button>
                    )
                  )}
                  {relatedTask.status === 'completed' && (
                    <div className="flex items-center justify-center gap-2 py-2 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Task Completed</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link to="/vault">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Save to Vault
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </Link>
                <Link to={`/payment?amount=127.45&title=${encodeURIComponent(email.subject)}&emailId=${email.id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;