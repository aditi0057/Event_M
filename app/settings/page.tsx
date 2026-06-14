"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast"
import { changePassword, fetchUserSettings, updateUserSettings } from "@/services/api"

const settingOptions = [
  ["eventReminders", "Event reminders"],
  ["birthdayAlerts", "Birthday alerts"],
  ["pollNotifications", "Poll notifications"],
  ["galleryApprovals", "Gallery approvals"],
  ["weeklyEmailDigest", "Email digest (weekly)"],
  ["showBirthdayOnCalendar", "Show my birthday on company calendar"],
  ["showAnniversaryOnCalendar", "Show my work anniversary"],
] as const

export default function SettingsPage() {
  const [dangerOpen, setDangerOpen] = useState(false)
  const [settings, setSettings] = useState<Record<string, boolean>>(() => Object.fromEntries(settingOptions.map(([key]) => [key, true])))
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserSettings()
      .then((data) => setSettings((current) => ({ ...current, ...data })))
      .catch(() => toast("Could not load saved settings.", "warning"))
  }, [toast])

  const toggle = (key: string, value: boolean) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const saveSettings = async () => {
    setSettingsSaving(true)
    try {
      await updateUserSettings(settings)
      toast("Settings saved.", "success")
    } catch (error: any) {
      toast(error.message || "Could not save settings.", "error")
    } finally {
      setSettingsSaving(false)
    }
  }

  const savePassword = async () => {
    setPasswordError("")
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordError("All password fields are required.")
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }
    setPasswordSaving(true)
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast("Password changed successfully.", "success")
    } catch (error: any) {
      setPasswordError(error.message || "Current password is incorrect.")
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <section className="page-shell">
      <div className="wrapper max-w-3xl space-y-6 py-10">
        <div className="section-header"><div><p className="eyebrow">Account</p><h1 className="mt-2 text-3xl font-semibold">Settings</h1></div></div>
        <div className="surface divide-y divide-[var(--color-border)]">
          {settingOptions.map(([key, label]) => <label key={key} className="flex items-center justify-between gap-4 p-4 text-sm font-semibold"><span>{label}</span><input type="checkbox" checked={settings[key]} onChange={(event) => toggle(key, event.target.checked)} className="h-5 w-5 accent-[var(--color-accent)]" /></label>)}
        </div>
        <div className="flex justify-end"><Button onClick={saveSettings} disabled={settingsSaving}>{settingsSaving ? "Saving..." : "Save settings"}</Button></div>
        <div className="surface grid gap-4 p-5"><h2 className="text-xl font-semibold">Change password</h2><Input label="Current password" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} /><Input label="New password" type="password" value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} /><Input label="Confirm password" type="password" value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))} />{passwordError && <p className="text-sm text-[var(--color-danger)]">{passwordError}</p>}<Button onClick={savePassword} disabled={passwordSaving}>{passwordSaving ? "Saving..." : "Save password"}</Button></div>
        <div className="surface grid gap-4 border-[var(--color-danger)] p-5"><h2 className="text-xl font-semibold text-[var(--color-danger)]">Danger zone</h2><p className="text-sm text-[var(--color-text-secondary)]">Deleting your account requires typing DELETE in the confirmation step.</p><Button variant="danger" onClick={() => setDangerOpen(true)}>Delete account</Button></div>
      </div>
      <ConfirmDialog open={dangerOpen} title="Delete account" description="This will permanently delete your account and cannot be undone." dangerous onCancel={() => setDangerOpen(false)} onConfirm={() => { setDangerOpen(false); toast("Delete request captured.", "warning") }} />
    </section>
  )
}
