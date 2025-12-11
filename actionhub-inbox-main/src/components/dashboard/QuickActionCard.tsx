import { useNavigate } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  onClick?: () => void;
  url?: string;
}

const QuickActionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  category, 
  categoryColor,
  onClick,
  url
}: QuickActionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank');
    } else {
      // Default: navigate to payment page with the action title
      navigate(`/payment?title=${encodeURIComponent(title)}&amount=${Math.floor(Math.random() * 500) + 50}.00`);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="quick-action-btn w-full text-left group"
    >
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: `${categoryColor}20` }}
      >
        <Icon 
          className="w-5 h-5"
          style={{ color: categoryColor }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
};

export default QuickActionCard;
