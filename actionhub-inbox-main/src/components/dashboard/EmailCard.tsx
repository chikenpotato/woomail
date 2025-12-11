import { useNavigate } from 'react-router-dom';
import { Email } from '@/types';
import { getCategoryConfig, formatTimeAgo } from '@/lib/categoryUtils';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailCardProps {
  email: Email;
  onClick?: () => void;
}

const EmailCard = ({ email, onClick }: EmailCardProps) => {
  const navigate = useNavigate();
  const config = getCategoryConfig(email.category);
  const Icon = config.icon;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/email/${email.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "task-card cursor-pointer",
        !email.isRead && "border-l-2 border-l-primary"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={cn("p-2 rounded-lg flex-shrink-0", config.bgClass)}>
          <Icon className={cn("w-4 h-4", config.textClass)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "text-sm",
              !email.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
            )}>
              {email.sender}
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTimeAgo(email.receivedAt)}
            </span>
          </div>
          
          <p className={cn(
            "text-sm mt-1 line-clamp-1",
            !email.isRead ? "text-foreground" : "text-muted-foreground"
          )}>
            {email.subject}
          </p>
          
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {email.preview}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-2">
            <span className={cn(
              "category-badge",
              config.bgClass,
              config.textClass
            )}>
              {config.label}
            </span>
            {email.hasAttachment && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="w-3 h-3" />
                Attachment
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCard;
