import { Input } from "@/components/ui/input"

export function DatePicker(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} type="date" />
}
