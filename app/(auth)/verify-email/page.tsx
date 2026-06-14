import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return <div className="surface w-full max-w-md p-7 text-center"><h1 className="text-2xl font-semibold">Check your inbox</h1><p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">Verify your email before logging in.</p><Button asChild className="mt-6"><Link href="/sign-in">Back to sign in</Link></Button></div>
}
