import { CategoryCount, EmailCategory } from '@/types';
import { getCategoryConfig } from '@/lib/categoryUtils';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  data: CategoryCount;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard = ({ data, isSelected, onClick }: CategoryCardProps) => {
  const config = getCategoryConfig(data.category);
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-4 text-left transition-all duration-200 hover:scale-[1.02] w-full",
        isSelected && "ring-2 ring-primary glow-primary"
      )}
    >
      <div className="flex items-start justify-between">
        <div 
          className={cn("p-2.5 rounded-lg", config.bgClass)}
        >
          <Icon className={cn("w-5 h-5", config.textClass)} />
        </div>
        {data.unread > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
            {data.unread} new
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-foreground">{config.label}</p>
        <p className="text-2xl font-semibold text-foreground mt-1">{data.count}</p>
      </div>
    </button>
  );
};

export default CategoryCard;
