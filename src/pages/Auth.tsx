import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthMethod = 'phone' | 'email';
type AuthStep = 'identifier' | 'otp';

const DEFAULT_OTP = '0000';

const Auth = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [step, setStep] = useState<AuthStep>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      toast.error(`Please enter your ${method === 'phone' ? 'phone number' : 'email'}`);
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`OTP sent to ${identifier}`, {
      description: 'Use 0000 as the default OTP for testing'
    });
    setStep('otp');
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 4) {
      toast.error('Please enter the complete OTP');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to verify OTP and create/update user
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: { identifier, method, otp }
      });

      if (verifyError) {
        throw verifyError;
      }

      if (verifyData?.error) {
        if (verifyData.code === 'invalid_otp') {
          toast.error('Invalid OTP', {
            description: 'Please use 0000 as the default OTP'
          });
          setIsLoading(false);
          return;
        }
        throw new Error(verifyData.error);
      }

      // Now sign in with the credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: verifyData.email,
        password: verifyData.password,
      });

      if (signInError) {
        throw signInError;
      }

      toast.success(verifyData.isNewUser ? 'Welcome!' : 'Welcome back!', {
        description: verifyData.isNewUser 
          ? 'Your account has been created successfully' 
          : 'You have been signed in successfully'
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('Authentication failed', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('identifier');
      setOtp('');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen gradient-warm flex flex-col">
      {/* Header */}
      <header className="p-4">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              FeelGood
            </span>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl shadow-medium p-8">
            {step === 'identifier' ? (
              <>
                <h1 className="text-2xl font-display font-bold text-center mb-2">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                  Sign in to continue to your account
                </p>

                {/* Method Toggle */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={method === 'phone' ? 'default' : 'outline'}
                    className={`flex-1 ${method === 'phone' ? 'gradient-primary border-0' : ''}`}
                    onClick={() => {
                      setMethod('phone');
                      setIdentifier('');
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                  <Button
                    type="button"
                    variant={method === 'email' ? 'default' : 'outline'}
                    className={`flex-1 ${method === 'email' ? 'gradient-primary border-0' : ''}`}
                    onClick={() => {
                      setMethod('email');
                      setIdentifier('');
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>

                {/* Identifier Form */}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {method === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <Input
                      type={method === 'phone' ? 'tel' : 'email'}
                      placeholder={method === 'phone' ? '+1 (555) 000-0000' : 'you@example.com'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="h-12"
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-display font-bold text-center mb-2">
                  Enter OTP
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                  We sent a code to <span className="font-medium text-foreground">{identifier}</span>
                </p>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={4}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                        <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>For testing, use <span className="font-mono font-bold text-foreground">0000</span></p>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline" target="_blank">
                        Terms & Conditions
                      </Link>
                      {' '}and{' '}
                      <Link to="/terms" className="text-primary hover:underline" target="_blank">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 gradient-primary border-0 shadow-soft hover:shadow-glow transition-shadow"
                    disabled={isLoading || otp.length !== 4 || !termsAccepted}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </form>

                {/* Resend */}
                <button 
                  onClick={() => {
                    toast.success('OTP resent!', {
                      description: 'Use 0000 as the default OTP'
                    });
                  }}
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  Didn't receive the code? <span className="font-medium">Resend</span>
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/terms" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
