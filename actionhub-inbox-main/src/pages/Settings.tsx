import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Link2, 
  Key,
  Smartphone,
  Globe,
  HelpCircle
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />

      <div className="p-6 max-w-3xl">
        {/* Profile Section */}
        <section className="glass-card p-6 mb-6 animate-slide-up opacity-0 stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">John Tan</p>
              <p className="text-sm text-muted-foreground">john.tan@email.com</p>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="ml-auto">
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Tan" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.tan@email.com" />
            </div>
          </div>
        </section>

        {/* Email Connections */}
        <section className="glass-card p-6 mb-6 animate-slide-up opacity-0 stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Connected Email Accounts</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/15">
                  <Globe className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Gmail</p>
                  <p className="text-sm text-muted-foreground">john.tan@gmail.com</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">Connected</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-category-insurance/15">
                  <Globe className="w-4 h-4 text-category-insurance" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Outlook</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-card p-6 mb-6 animate-slide-up opacity-0 stagger-3">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email alerts for urgent tasks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser push notifications for deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Deadline Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded 3 days before due dates</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="glass-card p-6 animate-slide-up opacity-0 stagger-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Key className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Singpass Integration</p>
                  <p className="text-sm text-muted-foreground">Connect via Singpass for secure access</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
