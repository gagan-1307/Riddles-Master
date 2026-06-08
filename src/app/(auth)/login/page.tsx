'use client';

import { useState } from 'react';
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

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const redirectUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/auth/callback';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) {
      setErrorMsg(error.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/problems');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] p-6 text-[#141413]">
      <Card className="w-full max-w-[400px] border-[#e6dfd8] bg-[#faf9f5] shadow-none rounded-[12px] p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#141413]">Welcome back</CardTitle>
          <CardDescription className="text-sm text-[#6c6a64]">Continue your journey to technical mastery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full justify-center border-[#e6dfd8] hover:bg-[#f5f0e8] hover:text-[#141413] rounded-[8px]"
          >
            Continue with Google
          </Button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#e6dfd8]"></div>
            <span className="mx-4 text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">Or</span>
            <div className="flex-grow border-t border-[#e6dfd8]"></div>
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">Password</Label>
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
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-[#3d3d3a]">
            Don't have an account?{' '}
            <a href="/register" className="font-semibold text-[#cc785c] hover:underline">
              Sign up for free
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
