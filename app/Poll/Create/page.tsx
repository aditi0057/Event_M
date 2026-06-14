"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { createPoll } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/context/AuthContent"

export default function CreatePollPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [question, setQuestion] = useState("")
  const [tab, setTab] = useState("Venue")
  const [options, setOptions] = useState(["", ""])
  const [deadline, setDeadline] = useState("")
  const [multiple, setMultiple] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user?.role !== "admin") {
      toast("You don't have permission to create polls.", "error")
      router.replace("/Poll")
    }
  }, [authLoading, router, toast, user])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanOptions = options.map((option) => option.trim()).filter(Boolean)
    if (!question.trim() || cleanOptions.length < 2) { setError("Question and at least two options are required."); return }
    setIsLoading(true)
    try {
      const now = new Date().toISOString()
      const end = deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString()
      await createPoll({ question, tab, options: cleanOptions, start_time: now, end_time: end, allowMultipleVotes: multiple })
      toast("Poll created successfully.", "success")
      router.push("/Poll")
    } catch (err: any) {
      toast(err.message || "Could not create poll.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-shell">
      <div className="wrapper max-w-2xl space-y-8 py-10">
        <div className="section-header"><div><p className="eyebrow">Team decisions</p><h1 className="mt-2 text-3xl font-semibold">Create Poll</h1></div></div>
        <form onSubmit={submit} className="surface grid gap-5 p-6">
          <Input label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} error={error && !question ? error : ""} />
          <Select label="Category" value={tab} onChange={setTab} options={["Venue", "Schedule", "Food", "Others"].map((value) => ({ label: value, value }))} />
          <div className="grid gap-3">
            <label className="text-sm font-semibold">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input placeholder={`Option ${index + 1}`} value={option} onChange={(e) => setOptions((current) => current.map((item, i) => i === index ? e.target.value : item))} />
                {options.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => setOptions((current) => current.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="secondary" disabled={options.length >= 8} onClick={() => setOptions((current) => [...current, ""])}>Add option</Button>
          </div>
          <Input label="Voting deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} helperText="Optional. Defaults to seven days." />
          <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} /> Allow multiple votes</label>
          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="secondary" onClick={() => router.push("/Poll")}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Poll"}</Button>
          </div>
        </form>
      </div>
    </section>
  )
}
