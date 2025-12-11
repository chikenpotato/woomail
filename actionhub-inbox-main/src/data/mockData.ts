import { Email, Task, Attachment, CategoryCount } from '@/types';

import emailsJson from './emails.json';
import tasksJson from './tasks.json';
import attachmentsJson from './attachments.json';

/* ============================================================
   CATEGORY NORMALIZATION — FIXES THE "icon undefined" CRASH
   ============================================================ */

const normalizeCategory = (raw?: string): string => {
  if (!raw) return 'misc';

  const key = raw.toLowerCase();

  if (key.includes('bill') || key.includes('statement')) return 'bills';
  if (key.includes('finance') || key.includes('bank')) return 'finance';
  if (key.includes('renewal') || key.includes('contract')) return 'employment';
  if (key.includes('license') || key.includes('government')) return 'government';
  if (key.includes('education') || key.includes('school')) return 'education';
  if (key.includes('health')) return 'healthcare';
  if (key.includes('insurance')) return 'insurance';

  return 'misc';
};

/* ============================================================
   EMAILS
   ============================================================ */

export const mockEmails: Email[] = (emailsJson as any[]).map((e) => ({
  id: String(e.id),
  subject: e.subject,
  sender:
    e.analysis?.org ??
    e.analysis?.sender ??
    e.senderEmail?.split('@')[0] ??
    'Unknown',
  senderEmail: e.senderEmail,
  preview: e.analysis?.preview ?? '',
  category: normalizeCategory(e.analysis?.category) as any,
  receivedAt: new Date(e.receivedAt),
  isRead: e.analysis?.isRead ?? false,
  hasAttachment: e.analysis?.hasAttachments ?? false,
}));

/* ============================================================
   TASKS
   ============================================================ */

export const mockTasks: Task[] = (tasksJson as any[]).map((t) => ({
  id: String(t.id),
  title: t.title,
  description: t.description,
  emailId: String(t.emailId),
  category: normalizeCategory(t.category) as any,
  priority: t.priority ?? 'normal',
  status: t.status ?? 'pending',
  dueDate: new Date(t.dueDate),
  createdAt: new Date(t.createdAt),
  quickActionType: t.quickActionType,
}));

/* ============================================================
   ATTACHMENTS
   ============================================================ */

export const mockAttachments: Attachment[] = (attachmentsJson as any[]).map(
  (a) => ({
    id: String(a.id),
    fileName: a.fileName,
    fileType: a.fileType,
    fileSize: a.fileSize,
    category: normalizeCategory(a.category) as any,
    uploadedAt: new Date(a.uploadedAt),
    emailId: String(a.emailId),
  })
);

/* ============================================================
   CATEGORY COUNTS (STATIC – SAME AS ORIGINAL)
   ============================================================ */

export const mockCategoryCounts: CategoryCount[] = [
  { category: 'government', count: 12, unread: 3 },
  { category: 'finance', count: 28, unread: 5 },
  { category: 'bills', count: 15, unread: 2 },
  { category: 'healthcare', count: 8, unread: 1 },
  { category: 'education', count: 6, unread: 0 },
  { category: 'insurance', count: 10, unread: 2 },
  { category: 'employment', count: 4, unread: 1 },
  { category: 'misc', count: 35, unread: 8 },
];
