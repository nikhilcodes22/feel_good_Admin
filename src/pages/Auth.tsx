import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/stores/authStore';
import api, { isApiConfigured } from '@/lib/api';
import { toast } from 'sonner';
import feelgoodLogo from '@/assets/feelgood-logo.png';

type AuthMethod = 'phone' | 'email';
type AuthStep = 'identifier' | 'otp';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [step, setStep] = useState<AuthStep>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [session, setSession] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'orgRep') {
        navigate('/orgrep/dashboard', { replace: true });
      } else if (user.role === 'volunteer') {
        navigate('/volunteer/my-events', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error(`Please enter your ${method === 'phone' ? 'phone number' : 'email'}`);
      return;
    }

    if (!isApiConfigured) {
      toast.error('Backend API not configured');
      return;
    }

    setIsLoading(true);
    try {
      if (method === 'phone') {
        const cleaned = identifier.replace(/\D/g, '');
        if (cleaned.length < 10) {
          toast.error('Enter a valid phone number');
          setIsLoading(false);
          return;
        }
        const fullPhone = cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
        const res = await api.post('/api/auth/send-otp', { phone: fullPhone });
        setSession(res.data.session);
      } else {
        const res = await api.post('/api/auth/send-otp', { email: identifier });
        setSession(res.data.session);
      }
      toast.success(`OTP sent to ${identifier}`);
      setStep('otp');
      setResendTimer(30);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Network error';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/resend-otp', { session });
      setResendTimer(30);
      toast.success('OTP resent');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Network error';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 4) {
      toast.error('Enter 4-digit OTP');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { session, otp };
      if (method === 'phone') {
        const cleaned = identifier.replace(/\D/g, '');
        payload.phone = cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
      } else {
        payload.email = identifier;
      }

      const res = await api.post('/api/auth/verify-otp', payload);
      const { user: u, accessToken, refreshToken } = res.data;

      if (u.role !== 'volunteer' && u.role !== 'orgRep' && !u.isSuperAdmin) {
        toast.error('Access denied.');
        setIsLoading(false);
        return;
      }

      setAuth(u, accessToken, refreshToken);
      toast.success(`Welcome, ${u.firstName}!`);

      if (u.isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (u.role === 'orgRep') {
        navigate('/orgrep/dashboard', { replace: true });
      } else if (u.role === 'volunteer') {
        navigate('/volunteer/my-events', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      toast.error(msg);
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
            <img
              src={feelgoodLogo}
              alt="FeelGood Logo"
              className="w-12 h-12"
            />
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
                    {method === 'phone' ? (
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-muted rounded-md text-sm font-medium text-muted-foreground">
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="10-digit phone number"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="h-12 flex-1"
                          disabled={isLoading}
                        />
                      </div>
                    ) : (
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="h-12"
                        disabled={isLoading}
                      />
                    )}
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
                <div className="text-center mt-4">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      disabled={isLoading}
                    >
                      Didn't receive the code? <span className="font-medium">Resend</span>
                    </button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => { setStep('identifier'); setOtp(''); }}
                >
                  ← Change {method === 'phone' ? 'phone number' : 'email'}
                </Button>
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
