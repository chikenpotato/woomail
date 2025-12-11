import { Attachment } from '@/types';
import { getCategoryConfig, formatFileSize, formatTimeAgo } from '@/lib/categoryUtils';
import { FileText, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  document: Attachment;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const config = getCategoryConfig(document.category);

  return (
    <div className="glass-card p-4 group">
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className={cn("p-3 rounded-lg", config.bgClass)}>
          <FileText className={cn("w-6 h-6", config.textClass)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{document.fileName}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{formatFileSize(document.fileSize)}</span>
            <span>•</span>
            <span>{formatTimeAgo(document.uploadedAt)}</span>
          </div>
          <span className={cn(
            "category-badge mt-2 inline-block",
            config.bgClass,
            config.textClass
          )}>
            {config.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
