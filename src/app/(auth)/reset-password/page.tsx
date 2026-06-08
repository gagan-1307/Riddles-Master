'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const useRouter = () => ({
  push: (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    // Listen for the RECOVERY auth state event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Your password has been successfully updated. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] p-6 text-[#141413]">
      <Card className="w-full max-w-[400px] border-[#e6dfd8] bg-[#faf9f5] shadow-none rounded-[12px] p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#141413]">Set New Password</CardTitle>
          <CardDescription className="text-sm text-[#6c6a64]">Please enter and confirm your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          {successMsg ? (
            <div className="text-sm font-medium text-[#5db872] p-4 bg-[#5db872]/10 rounded border border-[#5db872]/20 text-center">
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#e6dfd8] bg-[#faf9f5] focus:border-[#cc785c] rounded-[8px]"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-[#e6dfd8] bg-[#faf9f5] focus:border-[#cc785c] rounded-[8px]"
                  placeholder="••••••••"
                />
              </div>
              {errorMsg && (
                <div className="text-sm font-medium text-[#c64545] p-2 bg-[#c64545]/10 rounded border border-[#c64545]/20">
                  {errorMsg}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white rounded-[8px]"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
