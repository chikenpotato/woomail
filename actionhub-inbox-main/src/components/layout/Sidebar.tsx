import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  FolderOpen, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  Inbox,
  CheckCircle,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryConfig } from '@/lib/categoryUtils';
import { useEmailStore } from '@/hooks/useEmailStore';
import { EmailCategory } from '@/types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState(true);
  const { emails, tasks, trashedEmails, getEmailCountByCategory } = useEmailStore();

  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const mainNavItems = [
    { path: '/dashboard', icon: Inbox, label: 'Smart Inbox', badge: emails.length },
    { path: '/tasks', icon: CheckSquare, label: 'Task Timeline', badge: pendingTasksCount },
    { path: '/vault', icon: FolderOpen, label: 'Document Vault', badge: null },
    { path: '/quick-actions', icon: Zap, label: 'Quick Actions', badge: null },
    { path: '/trash', icon: Trash2, label: 'Trash', badge: trashedEmails.length > 0 ? trashedEmails.length : null },
    { path: '/help', icon: HelpCircle, label: 'Help & Support', badge: null },
  ];

  const categories = Object.entries(categoryConfig) as [EmailCategory, typeof categoryConfig[EmailCategory]][];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">woomail</span>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item group relative",
                isActive && "active"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-medium rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Categories Section */}
        {!collapsed && (
          <div className="pt-4">
            <button 
              onClick={() => setExpandedCategories(!expandedCategories)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              <span>Categories</span>
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform",
                expandedCategories && "rotate-90"
              )} />
            </button>
            
            {expandedCategories && (
              <div className="space-y-0.5 mt-1">
                {categories.map(([key, config]) => {
                  const counts = getEmailCountByCategory(key);
                  return (
                    <NavLink
                      key={key}
                      to={`/dashboard?category=${key}`}
                      className="nav-item group"
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="flex-1 text-sm">{config.label}</span>
                      {counts.unread > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {counts.unread}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/settings"
          className={cn(
            "nav-item",
            location.pathname === '/settings' && "active"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button 
          onClick={() => navigate('/login')}
          className="nav-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;