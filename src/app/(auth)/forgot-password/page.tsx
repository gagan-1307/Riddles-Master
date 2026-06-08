'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const redirectUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/auth/reset-password';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Check your email for password reset instructions.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] p-6 text-[#141413]">
      <Card className="w-full max-w-[400px] border-[#e6dfd8] bg-[#faf9f5] shadow-none rounded-[12px] p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#141413]">Reset Password</CardTitle>
          <CardDescription className="text-sm text-[#6c6a64]">Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {successMsg ? (
            <div className="text-sm font-medium text-[#5db872] p-4 bg-[#5db872]/10 rounded border border-[#5db872]/20 text-center">
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#e6dfd8] bg-[#faf9f5] focus:border-[#cc785c] rounded-[8px]"
                  placeholder="name@example.com"
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-[#3d3d3a]">
            Back to{' '}
            <a href="/login" className="font-semibold text-[#cc785c] hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
