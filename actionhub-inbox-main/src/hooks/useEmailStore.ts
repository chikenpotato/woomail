import { create } from 'zustand';
import { Email, Task, EmailCategory } from '@/types';
import { mockEmails, mockTasks as initialTasks } from '@/data/mockData';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdAt: Date;
  isRead: boolean;
}

interface EmailStore {
  emails: Email[];
  tasks: Task[];
  trashedEmails: Email[];
  notifications: Notification[];
  deleteEmail: (id: string) => void;
  permanentlyDeleteEmail: (id: string) => void;
  restoreEmail: (id: string) => void;
  emptyTrash: () => void;
  archiveEmail: (id: string) => void;
  starEmail: (id: string) => void;
  markAsRead: (id: string) => void;
  completeTask: (taskId: string) => void;
  completeTaskByEmailId: (emailId: string) => void;
  getEmailCountByCategory: (category: EmailCategory) => { count: number; unread: number };
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Tax Payment Due Soon',
    message: 'Your IRAS tax payment is due in 5 days',
    type: 'warning',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '2',
    title: 'New Email from CPF Board',
    message: 'Your CPF Statement is ready',
    type: 'info',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '3',
    title: 'Passport Expiring',
    message: 'Your passport expires in 37 days',
    type: 'warning',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
];

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: mockEmails,
  tasks: initialTasks,
  trashedEmails: [],
  notifications: initialNotifications,
  
  deleteEmail: (id) => set((state) => {
    const emailToTrash = state.emails.find(e => e.id === id);
    if (!emailToTrash) return state;
    return {
      emails: state.emails.filter(e => e.id !== id),
      trashedEmails: [...state.trashedEmails, emailToTrash],
    };
  }),
  
  permanentlyDeleteEmail: (id) => set((state) => ({
    trashedEmails: state.trashedEmails.filter(e => e.id !== id),
  })),
  
  restoreEmail: (id) => set((state) => {
    const emailToRestore = state.trashedEmails.find(e => e.id === id);
    if (!emailToRestore) return state;
    return {
      trashedEmails: state.trashedEmails.filter(e => e.id !== id),
      emails: [...state.emails, emailToRestore],
    };
  }),
  
  emptyTrash: () => set({ trashedEmails: [] }),
  
  archiveEmail: (id) => set((state) => ({
    emails: state.emails.filter(e => e.id !== id),
  })),
  
  starEmail: (id) => set((state) => ({
    emails: state.emails.map(e => 
      e.id === id ? { ...e, isStarred: !e.isStarred } : e
    ),
  })),
  
  markAsRead: (id) => set((state) => ({
    emails: state.emails.map(e => 
      e.id === id ? { ...e, isRead: true } : e
    ),
  })),
  
  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ),
  })),
  
  completeTaskByEmailId: (emailId) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.emailId === emailId ? { ...t, status: 'completed' as const } : t
    ),
  })),
  
  getEmailCountByCategory: (category) => {
    const state = get();
    const categoryEmails = state.emails.filter(e => e.category === category);
    return {
      count: categoryEmails.length,
      unread: categoryEmails.filter(e => !e.isRead).length,
    };
  },
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ),
  })),
  
  clearNotifications: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
  })),
}));
