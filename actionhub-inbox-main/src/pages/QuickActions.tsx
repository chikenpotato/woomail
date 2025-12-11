import Header from '@/components/layout/Header';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { categoryConfig } from '@/lib/categoryUtils';
import { 
  CreditCard, 
  RefreshCw, 
  Calendar, 
  Upload, 
  ExternalLink,
  FileCheck,
  Building2,
  Landmark,
  Heart,
  Shield
} from 'lucide-react';

const quickActions = [
  {
    icon: CreditCard,
    title: 'Pay IRAS Tax',
    description: 'Complete your income tax payment via PayNow',
    category: 'Government',
    categoryColor: categoryConfig.government.color,
  },
  {
    icon: RefreshCw,
    title: 'Renew Passport',
    description: 'Start your passport renewal application online',
    category: 'Government',
    categoryColor: categoryConfig.government.color,
  },
  {
    icon: CreditCard,
    title: 'Pay SP Bill',
    description: 'Pay your utilities bill - $127.45 due',
    category: 'Bills',
    categoryColor: categoryConfig.bills.color,
  },
  {
    icon: Calendar,
    title: 'View Polyclinic Appointment',
    description: 'Bedok Polyclinic - 12 Dec 2024, 10:30 AM',
    category: 'Healthcare',
    categoryColor: categoryConfig.healthcare.color,
  },
  {
    icon: RefreshCw,
    title: 'Renew Motor Insurance',
    description: 'NTUC Income policy expires on 20 Dec 2024',
    category: 'Insurance',
    categoryColor: categoryConfig.insurance.color,
  },
  {
    icon: Calendar,
    title: 'Book EP Collection',
    description: 'Schedule appointment to collect Employment Pass',
    category: 'Employment',
    categoryColor: categoryConfig.employment.color,
  },
  {
    icon: Upload,
    title: 'Upload Documents to MyFileSG',
    description: 'Submit required documents securely',
    category: 'Government',
    categoryColor: categoryConfig.government.color,
  },
  {
    icon: FileCheck,
    title: 'Update MyInfo Address',
    description: 'Update your registered address via Singpass',
    category: 'Government',
    categoryColor: categoryConfig.government.color,
  },
  {
    icon: Landmark,
    title: 'View CPF Statement',
    description: 'Check your latest CPF contributions',
    category: 'Finance',
    categoryColor: categoryConfig.finance.color,
  },
  {
    icon: CreditCard,
    title: 'Pay Credit Card Bill',
    description: 'DBS Altitude Visa - $2,456.78 due',
    category: 'Finance',
    categoryColor: categoryConfig.finance.color,
  },
];

const QuickActions = () => {
  return (
    <div className="min-h-screen">
      <Header 
        title="Quick Actions" 
        subtitle="One-click shortcuts for common tasks"
      />

      <div className="p-6">
        {/* Hero Section */}
        <div className="glass-card p-6 mb-8 animate-slide-up opacity-0">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/15">
              <ExternalLink className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Instant Actions</h2>
              <p className="text-muted-foreground mt-1">
                These shortcuts are automatically generated from your emails. 
                Click any action to complete it instantly via the official portal.
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {/* Government Actions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-category-government" />
              <h3 className="text-lg font-semibold text-foreground">Government Services</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions
                .filter(a => a.category === 'Government')
                .map((action, index) => (
                  <div 
                    key={action.title}
                    className="animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <QuickActionCard {...action} />
                  </div>
                ))}
            </div>
          </section>

          {/* Finance Actions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-5 h-5 text-category-finance" />
              <h3 className="text-lg font-semibold text-foreground">Finance & Banking</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions
                .filter(a => a.category === 'Finance')
                .map((action, index) => (
                  <div 
                    key={action.title}
                    className="animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <QuickActionCard {...action} />
                  </div>
                ))}
            </div>
          </section>

          {/* Other Actions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Other Services</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions
                .filter(a => !['Government', 'Finance'].includes(a.category))
                .map((action, index) => (
                  <div 
                    key={action.title}
                    className="animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <QuickActionCard {...action} />
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
