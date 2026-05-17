'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    mobileNumber: '',
    dateOfBirth: '',
    maritalStatus: 'Single',
    workJoiningDate: '',
    anniversaryDate: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'anniversaryDate' && formData.maritalStatus === 'Single') return;
      submissionData.append(key, value);
    });
    if (avatar) {
      submissionData.append('avatar', avatar);
    }

    try {
      const apiUrl = `${API_URL}/users/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: submissionData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      
      router.push('/sign-in');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="surface my-4 w-full max-w-2xl p-7">
      <div className="mb-6">
        <p className="eyebrow">Employee access</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1f2933]">Create Account</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <Input type="tel" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required />
        
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]">Date of Birth</label>
          <Input type="date" name="dateOfBirth" onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]">Work Joining Date</label>
          <Input type="date" name="workJoiningDate" onChange={handleChange} required />
        </div>
        
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="h-11 border border-[#cfd6dd] bg-white px-3 text-sm text-[#1f2933] focus:outline-none focus:ring-2 focus:ring-[#1f2933]">
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>

        {formData.maritalStatus === 'Married' && (
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[#374151]">Anniversary Date</label>
              <Input type="date" name="anniversaryDate" onChange={handleChange} required />
            </div>
        )}

        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm font-semibold text-[#374151]">Avatar</label>
          <input type="file" name="avatar" onChange={handleFileChange} required accept="image/*" className="w-full text-sm text-[#6b7280] file:mr-4 file:border-0 file:bg-[#1f2933] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#111827]" />
        </div>

        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <Button type="submit" className="w-full sm:col-span-2">
          Sign Up
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-[#6b7280]">
        <p>
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-[#1f2933] underline-offset-4 hover:underline">
            Sign In
          </Link>
        </p>
      </div>

    </div>
  );
}

