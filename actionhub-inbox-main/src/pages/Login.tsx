import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Shield, CheckCircle, Sparkles, Clock, FolderOpen } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-blue-300/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Mail Icons Decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Mail className="absolute top-24 right-20 w-8 h-8 text-primary/20 rotate-12" />
          <Mail className="absolute top-40 left-16 w-6 h-6 text-purple-400/20 -rotate-12" />
          <Mail className="absolute bottom-40 right-32 w-10 h-10 text-primary/15 rotate-6" />
          <CheckCircle className="absolute top-32 left-1/3 w-5 h-5 text-success/30" />
          <CheckCircle className="absolute bottom-60 left-20 w-7 h-7 text-success/20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg glow-primary">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">woomail;</h1>
              <p className="text-sm text-muted-foreground">Smart Email Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Rule-based automation
            </span>
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Turn messy emails into<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">actionable tasks</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-md">
            Singapore's first rule-based email automation system. 
            Auto-categorize government, finance, healthcare emails and never miss a deadline again.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { icon: Mail, label: 'Auto-Categorization', desc: '8 smart categories', color: 'text-primary' },
              { icon: Clock, label: 'Task Timeline', desc: 'Never miss deadlines', color: 'text-warning' },
              { icon: FolderOpen, label: 'Document Vault', desc: 'Secure storage', color: 'text-success' },
              { icon: Shield, label: 'Singpass Ready', desc: 'Enterprise security', color: 'text-purple-500' },
            ].map((feature) => (
              <div key={feature.label} className="glass-card-elevated p-4 hover:shadow-lg transition-shadow duration-200">
                <feature.icon className={`w-5 h-5 ${feature.color} mb-2`} />
                <p className="font-medium text-foreground">{feature.label}</p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          © 2024 woomail;. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">woomail;</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to access your smart inbox</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@email.com" 
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 border-2 hover:bg-accent hover:border-primary/30 transition-all"
            onClick={() => navigate('/dashboard')}
          >
            <Shield className="w-4 h-4 mr-2 text-primary" />
            Sign in with Singpass
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:underline font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;