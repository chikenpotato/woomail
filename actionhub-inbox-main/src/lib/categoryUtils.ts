import { EmailCategory } from '@/types';
import { 
  Building2, 
  Landmark, 
  Receipt, 
  Heart, 
  GraduationCap, 
  Shield, 
  Briefcase, 
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';

export const categoryConfig: Record<EmailCategory, {
  label: string;
  icon: LucideIcon;
  color: string;
  bgClass: string;
  textClass: string;
}> = {
  government: {
    label: 'Government',
    icon: Building2,
    color: 'hsl(234 70% 55%)',
    bgClass: 'bg-category-government/15',
    textClass: 'text-category-government',
  },
  finance: {
    label: 'Finance',
    icon: Landmark,
    color: 'hsl(152 55% 42%)',
    bgClass: 'bg-category-finance/15',
    textClass: 'text-category-finance',
  },
  bills: {
    label: 'Bills & Utilities',
    icon: Receipt,
    color: 'hsl(38 85% 52%)',
    bgClass: 'bg-category-bills/15',
    textClass: 'text-category-bills',
  },
  healthcare: {
    label: 'Healthcare',
    icon: Heart,
    color: 'hsl(340 70% 55%)',
    bgClass: 'bg-category-healthcare/15',
    textClass: 'text-category-healthcare',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    color: 'hsl(270 60% 55%)',
    bgClass: 'bg-category-education/15',
    textClass: 'text-category-education',
  },
  insurance: {
    label: 'Insurance',
    icon: Shield,
    color: 'hsl(200 70% 50%)',
    bgClass: 'bg-category-insurance/15',
    textClass: 'text-category-insurance',
  },
  employment: {
    label: 'Employment',
    icon: Briefcase,
    color: 'hsl(24 80% 52%)',
    bgClass: 'bg-category-employment/15',
    textClass: 'text-category-employment',
  },
  misc: {
    label: 'Miscellaneous',
    icon: MoreHorizontal,
    color: 'hsl(220 20% 55%)',
    bgClass: 'bg-category-misc/15',
    textClass: 'text-category-misc',
  },
};

export const getCategoryConfig = (category: EmailCategory) => categoryConfig[category];

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
};

export const formatDaysUntil = (date: Date): { days: number; label: string; urgency: 'urgent' | 'warning' | 'normal' } => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let urgency: 'urgent' | 'warning' | 'normal' = 'normal';
  if (days <= 3) urgency = 'urgent';
  else if (days <= 7) urgency = 'warning';

  let label = '';
  if (days < 0) label = `${Math.abs(days)}d overdue`;
  else if (days === 0) label = 'Due today';
  else if (days === 1) label = 'Due tomorrow';
  else label = `${days} days left`;

  return { days, label, urgency };
};
