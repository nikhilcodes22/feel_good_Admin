import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import api, { isApiConfigured } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Phone } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [session, setSession] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'superAdmin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const ensureApiConfigured = () => {
    if (isApiConfigured) return true;
    toast.error('Set VITE_API_URL to your backend URL before using OTP login');
    return false;
  };

  const handleSendOtp = async () => {
    if (!ensureApiConfigured()) return;

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
      const res = await api.post('/api/auth/send-otp', { phone: fullPhone });
      setSession(res.data.session);
      setStep('otp');
      setResendTimer(30);
      toast.success('OTP sent successfully');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Network error – check your connection';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!ensureApiConfigured()) return;

    setLoading(true);
    try {
      await api.post('/api/auth/resend-otp', { session });
      setResendTimer(30);
      toast.success('OTP resent');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Network error – check your connection';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!ensureApiConfigured()) return;

    if (otp.length !== 4) {
      toast.error('Enter 4-digit OTP');
      return;
    }
    setLoading(true);
    const cleaned = phone.replace(/\D/g, '');
    const fullPhone = cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
    try {
      const res = await api.post('/api/auth/verify-otp', { session, otp, phone: fullPhone });
      const { user: u, accessToken, refreshToken } = res.data;
      if (u.role !== 'superAdmin') {
        toast.error('Access denied. SuperAdmin only.');
        return;
      }
      setAuth(u, accessToken, refreshToken);
      toast.success(`Welcome, ${u.firstName}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Network error – check your connection';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(207,90%,96%)] to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[hsl(207,90%,54%)] flex items-center justify-center">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">FeelGood Admin</CardTitle>
          <CardDescription>
            {step === 'phone' ? 'Enter your phone number to sign in' : 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-muted rounded-md text-sm font-medium text-muted-foreground">
                  +91
                </div>
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Verify OTP
              </Button>
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">Resend OTP in {resendTimer}s</p>
                ) : (
                  <Button variant="link" size="sm" onClick={handleResend} disabled={loading}>
                    Resend OTP
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => { setStep('phone'); setOtp(''); }}>
                ← Change phone number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
