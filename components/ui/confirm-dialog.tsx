"use client"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

export function ConfirmDialog({ title, description, open, onConfirm, onCancel, dangerous = false }: { title: string; description: string; open: boolean; onConfirm: () => void; onCancel: () => void; dangerous?: boolean }) {
  return (
    <Modal title={title} open={open} onClose={onCancel} size="sm">
      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant={dangerous ? "danger" : "primary"} onClick={onConfirm}>{dangerous ? "Delete" : "Confirm"}</Button>
      </div>
    </Modal>
  )
}
