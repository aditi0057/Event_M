"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Tooltip } from "@/components/ui/tooltip"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullname: "", email: "", username: "", password: "", confirmPassword: "", mobileNumber: "", dateOfBirth: "", workJoiningDate: "", maritalStatus: "Prefer not to say" })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [error, setError] = useState("")
  const strength = useMemo(() => form.password.length > 10 ? "Strong" : form.password.length > 6 ? "Fair" : "Weak", [form.password])
  const setField = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return }
    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => key !== "confirmPassword" && body.append(key, value))
    if (avatar) body.append("avatar", avatar)
    const response = await fetch(`${API_URL}/users/register`, { method: "POST", body })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) { setError(result.message || "Something went wrong."); return }
    router.push("/verify-email")
  }

  return (
    <div className="surface my-4 w-full max-w-[480px] p-7">
      <div className="mb-6"><p className="eyebrow">Employee access</p><h1 className="mt-2 text-2xl font-semibold">Create Account</h1></div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input label="Full Name" value={form.fullname} onChange={(e) => setField("fullname", e.target.value)} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
        <Input label="Username" value={form.username} onChange={(e) => setField("username", e.target.value)} required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} required />
        <div className="h-2 rounded-full bg-[var(--color-surface-2)]"><div className={`h-full rounded-full ${strength === "Strong" ? "w-full bg-[var(--color-success)]" : strength === "Fair" ? "w-2/3 bg-[var(--color-warning)]" : "w-1/3 bg-[var(--color-danger)]"}`} /></div>
        <p className="text-xs text-[var(--color-text-secondary)]">Password strength: {strength}</p>
        <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} required />
        <Input label="Mobile Number (optional)" value={form.mobileNumber} onChange={(e) => setField("mobileNumber", e.target.value)} />
        <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} helperText="Used only for birthday celebrations in the app." />
        <Input label="Work Joining Date" type="date" value={form.workJoiningDate} onChange={(e) => setField("workJoiningDate", e.target.value)} helperText="Used only for anniversary celebrations in the app." />
        <Tooltip content="Used only for birthday and anniversary celebrations in the app."><Info className="h-4 w-4 text-[var(--color-text-secondary)]" /></Tooltip>
        <Select label="Marital Status" value={form.maritalStatus} onChange={(value) => setField("maritalStatus", value)} options={["Prefer not to say", "Single", "Married", "Other"].map((value) => ({ label: value, value }))} />
        <FileUpload accept="image/*" onUpload={(files) => setAvatar(files[0] || null)} />
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
      <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">Already have an account? <Link href="/sign-in" className="font-semibold text-[var(--color-accent)]">Sign In</Link></p>
    </div>
  )
}
