import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useEmailStore } from '@/hooks/useEmailStore';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  CheckCircle,
  Shield,
  Lock,
  QrCode,
  Wallet
} from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('paynow');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const { completeTask, completeTaskByEmailId } = useEmailStore();

  const amount = searchParams.get('amount') || '127.45';
  const title = searchParams.get('title') || 'Bill Payment';
  const taskId = searchParams.get('task');
  const emailId = searchParams.get('emailId');

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
    
    // Mark task as completed
    if (taskId) {
      completeTask(taskId);
    }
    if (emailId) {
      completeTaskByEmailId(emailId);
    }
    
    toast({
      title: "Payment Successful!",
      description: `Your payment of $${amount} has been processed. The associated task has been marked as completed.`,
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Payment Complete" 
          subtitle="Your transaction has been processed"
        />
        <div className="p-6 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-2">
              Your payment of <span className="font-semibold text-foreground">${amount}</span> has been processed successfully.
            </p>
            <p className="text-sm text-success mb-6">
              ✓ Associated task marked as completed
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-foreground">TXN-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Status</span>
                <span className="text-success font-medium">Completed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Back to Inbox
              </Button>
              <Link to="/tasks" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground">
                  View Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Make Payment" 
        subtitle="Secure payment gateway"
      />

      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <div className="glass-card p-6 animate-slide-up opacity-0">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Summary</h2>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">{title}</span>
                <span className="font-semibold text-foreground">${amount}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${amount}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentMethod === 'paynow' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="paynow" />
                    <div className="p-2 rounded-lg bg-category-finance/20">
                      <QrCode className="w-5 h-5 text-category-finance" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">PayNow</p>
                      <p className="text-sm text-muted-foreground">Instant payment via QR code</p>
                    </div>
                  </label>

                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentMethod === 'card' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="card" />
                    <div className="p-2 rounded-lg bg-primary/20">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                    </div>
                  </label>

                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentMethod === 'giro' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="giro" />
                    <div className="p-2 rounded-lg bg-category-government/20">
                      <Building2 className="w-5 h-5 text-category-government" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">GIRO</p>
                      <p className="text-sm text-muted-foreground">Direct bank debit</p>
                    </div>
                  </label>

                  <label 
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentMethod === 'wallet' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value="wallet" />
                    <div className="p-2 rounded-lg bg-category-bills/20">
                      <Wallet className="w-5 h-5 text-category-bills" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">E-Wallet</p>
                      <p className="text-sm text-muted-foreground">GrabPay, PayLah, etc.</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Card Details (shown when card is selected) */}
            {paymentMethod === 'card' && (
              <div className="glass-card p-6 animate-slide-up opacity-0" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Card Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        type="password"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Tan" 
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayNow QR (shown when paynow is selected) */}
            {paymentMethod === 'paynow' && (
              <div className="glass-card p-6 animate-slide-up opacity-0 text-center" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-lg font-semibold text-foreground mb-4">Scan to Pay</h2>
                <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 shadow-md mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your banking app to complete payment
                </p>
              </div>
            )}

            {/* Pay Button */}
            <Button 
              className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Pay ${amount}
                </span>
              )}
            </Button>
          </div>

          {/* Security Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-success" />
                <h2 className="font-semibold text-foreground">Secure Payment</h2>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">256-bit Encryption</p>
                    <p className="text-muted-foreground">Your data is encrypted end-to-end</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Verified Merchants</p>
                    <p className="text-muted-foreground">All payments go directly to official agencies</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Instant Confirmation</p>
                    <p className="text-muted-foreground">Receive payment confirmation immediately</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;