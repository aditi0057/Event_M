"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  return <div className="surface w-full max-w-md p-7"><h1 className="text-2xl font-semibold">Forgot password?</h1><p className="mt-2 text-sm text-[var(--color-text-secondary)]">Enter your email and we will send a reset link.</p><div className="mt-6 grid gap-4"><Input label="Email" type="email" /> <Button onClick={() => setSent(true)}>Send reset link</Button>{sent && <p className="text-sm text-[var(--color-success)]">Reset link sent if the account exists.</p>}</div></div>
}
