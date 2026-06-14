"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  return <div className="surface w-full max-w-md p-7"><h1 className="text-2xl font-semibold">Reset Password</h1><div className="mt-6 grid gap-4"><Input label="New password" type="password" /><Input label="Confirm password" type="password" /><Button onClick={() => { toast("Password reset. Please sign in.", "success"); router.push("/sign-in") }}>Reset Password</Button></div></div>
}
