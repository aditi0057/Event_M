'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContent';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const apiUrl = `${API_URL}/users/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for sending/receiving cookies
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to login');
      }

      login(result.data.user); // Update the global auth state

      // Redirect based on user role
      if (result.data.user.role === 'admin') {
        router.push('/AdminDashboard');
      } else {
        router.push('/UserDashboard');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="surface w-full max-w-md p-7">
      <div className="mb-6">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1f2933]">Sign In</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-[#374151]">Email</label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-[#374151]">Password</label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-[#6b7280]">
        <p>
          Don't have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-[#1f2933] underline-offset-4 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

    </div>
  );
}

