export type EmailCategory = 
  | 'government'
  | 'finance'
  | 'bills'
  | 'healthcare'
  | 'education'
  | 'insurance'
  | 'employment'
  | 'misc';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  preview: string;
  category: EmailCategory;
  receivedAt: Date;
  isRead: boolean;
  isStarred?: boolean;
  hasAttachment: boolean;
  attachments?: Attachment[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  emailId?: string;
  category: EmailCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  quickActionType?: QuickActionType;
}

export interface QuickActionType {
  type: 'renew' | 'pay' | 'appointment' | 'upload' | 'verify' | 'link';
  label: string;
  url?: string;
  amount?: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: EmailCategory;
  uploadedAt: Date;
  emailId: string;
}

export interface CategoryCount {
  category: EmailCategory;
  count: number;
  unread: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
