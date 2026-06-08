'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'yahoo.in',
      'protonmail.com',
    ];

    if (!allowedDomains.includes(domain)) {
      setErrorMsg('Please use a personal email address (Gmail, Yahoo, Outlook)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setSuccessMsg('Registration successful! Please check your email to verify your account.');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] p-6 text-[#141413]">
      <Card className="w-full max-w-[400px] border-[#e6dfd8] bg-[#faf9f5] shadow-none rounded-[12px] p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#141413]">Create account</CardTitle>
          <CardDescription className="text-sm text-[#6c6a64]">Join the community of elite technical thinkers.</CardDescription>
        </CardHeader>
        <CardContent>
          {successMsg ? (
            <div className="text-sm font-medium text-[#5db872] p-4 bg-[#5db872]/10 rounded border border-[#5db872]/20 text-center">
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-[#e6dfd8] bg-[#faf9f5] focus:border-[#cc785c] rounded-[8px]"
                  placeholder="John Doe"
                />
              </div>
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
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-[#3d3d3a]">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-[#cc785c] hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
