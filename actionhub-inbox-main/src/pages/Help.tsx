import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  FileText,
  Shield,
  CreditCard,
  Inbox,
  Send
} from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    icon: Inbox,
    questions: [
      {
        q: 'How does woomail; work?',
        a: 'woomail; automatically categorizes your emails from government agencies, banks, and other important senders. It extracts actionable tasks and helps you stay on top of deadlines for payments, renewals, and appointments.'
      },
      {
        q: 'How do I connect my email account?',
        a: 'Go to Settings > Connected Email Accounts and click "Connect" next to your email provider. Follow the authentication steps to securely link your account.'
      },
      {
        q: 'Is my data secure?',
        a: 'Yes, we use bank-grade encryption and never store your email passwords. Your data is processed securely and we comply with Singapore\'s PDPA regulations.'
      }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods are supported?',
        a: 'We support PayNow, Credit/Debit Cards (Visa, Mastercard, AMEX), GIRO, and popular e-wallets like GrabPay and PayLah.'
      },
      {
        q: 'Are there any transaction fees?',
        a: 'woomail; does not charge any transaction fees. You pay directly to the service provider (e.g., IRAS, SP Group) at their standard rates.'
      },
      {
        q: 'How do I get a payment receipt?',
        a: 'After each successful payment, a receipt is automatically saved to your Document Vault and sent to your email.'
      }
    ]
  },
  {
    category: 'Documents',
    icon: FileText,
    questions: [
      {
        q: 'How are documents organized?',
        a: 'Documents are automatically categorized based on the sender and content type. You can also manually organize them using custom folders and tags.'
      },
      {
        q: 'Can I download my documents?',
        a: 'Yes, you can download individual documents or bulk export all documents in a category.'
      }
    ]
  },
  {
    category: 'Security',
    icon: Shield,
    questions: [
      {
        q: 'How is my data protected?',
        a: 'We use 256-bit SSL encryption, two-factor authentication, and comply with SOC 2 Type II security standards. Your data is stored in secure Singapore-based servers.'
      },
      {
        q: 'Can I enable two-factor authentication?',
        a: 'Yes, go to Settings > Security and click "Enable" next to Two-Factor Authentication. You can use SMS or an authenticator app.'
      }
    ]
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setContactForm({ subject: '', message: '' });
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Help & Support" 
        subtitle="Find answers or contact our team"
      />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Search */}
        <div className="glass-card p-6 mb-8 animate-slide-up opacity-0">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">How can we help you?</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg bg-muted/50"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/dashboard" className="glass-card p-4 hover:shadow-lg transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/15">
                <Inbox className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Smart Inbox</p>
                <p className="text-sm text-muted-foreground">View your emails</p>
              </div>
            </div>
          </Link>
          <Link to="/settings" className="glass-card p-4 hover:shadow-lg transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-category-government/15">
                <Shield className="w-5 h-5 text-category-government" />
              </div>
              <div>
                <p className="font-medium text-foreground">Security Settings</p>
                <p className="text-sm text-muted-foreground">Manage your account</p>
              </div>
            </div>
          </Link>
          <Link to="/vault" className="glass-card p-4 hover:shadow-lg transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-category-finance/15">
                <FileText className="w-5 h-5 text-category-finance" />
              </div>
              <div>
                <p className="font-medium text-foreground">Document Vault</p>
                <p className="text-sm text-muted-foreground">Access your files</p>
              </div>
            </div>
          </Link>
        </div>

        {/* FAQs */}
        <div className="glass-card p-6 mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">{category.category}</h3>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${idx}-${index}`}
                        className="border border-border rounded-lg px-4 bg-muted/30"
                      >
                        <AccordionTrigger className="text-left text-foreground hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                  className="bg-muted/50"
                />
              </div>
              <div>
                <Textarea 
                  placeholder="How can we help you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  rows={4}
                  className="bg-muted/50 resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground"
                disabled={isSending}
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@woomail;.sg</p>
                  <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+65 6123 4567</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am - 6pm SGT</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available during office hours</p>
                  <Button variant="link" className="text-primary p-0 h-auto mt-1">
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;