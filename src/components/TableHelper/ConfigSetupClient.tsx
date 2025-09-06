"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, X } from "lucide-react"

type ConfigOption = {
  id: string
  label: string
  category: string
  enabled: boolean
}

type Props = {
  initialOptions: ConfigOption[]
}

export default function ConfigSetupClient({ initialOptions }: Props) {
  const router = useRouter()
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>(initialOptions)

  const handleToggleChange = (id: string, enabled: boolean) => {
    setConfigOptions(prev => prev.map(option => (option.id === id ? { ...option, enabled } : option)))
  }

  const handleCancel = () => {
    router.push("/general/home")
  }

  const handleUpdate = () => {
    toast.success("Configuration Updated!", {
      description: "Your setup configuration has been saved successfully.",
      duration: 3000,
      position: "top-right",
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {configOptions.slice(0, 4).map(option => (
            <div key={option.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <span className="font-medium text-gray-900">{option.label}</span>
                <span className="text-sm text-gray-500 ml-2">({option.category})</span>
              </div>
              <Switch
                checked={option.enabled}
                onCheckedChange={(enabled: boolean) => handleToggleChange(option.id, enabled)}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {configOptions.slice(4).map(option => (
            <div key={option.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <span className="font-medium text-gray-900">{option.label}</span>
                <span className="text-sm text-gray-500 ml-2">({option.category})</span>
              </div>
              <Switch
                checked={option.enabled}
                onCheckedChange={(enabled: boolean) => handleToggleChange(option.id, enabled)}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
        <Button variant="destructive" onClick={handleCancel} className="flex items-center space-x-2">
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Button>
        <Button onClick={handleUpdate} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4" />
          <span>Update Info</span>
        </Button>
      </div>
    </div>
  )
}


