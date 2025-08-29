"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, X } from "lucide-react"

interface ConfigOption {
  id: string
  label: string
  category: string
  enabled: boolean
}

export default function GeneralConfigSetupPage() {
  const router = useRouter()
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([
    { id: "storage", label: "Storage", category: "Tech", enabled: true },
    { id: "simType", label: "Sim Type", category: "Tech", enabled: true },
    { id: "deviceCondition", label: "Device Condition", category: "Tech", enabled: true },
    { id: "productWarranty", label: "Product Warranty", category: "Tech", enabled: true },
    { id: "productSize", label: "Product Size", category: "Fashion", enabled: true },
    { id: "region", label: "Region", category: "Common", enabled: true },
    { id: "productColor", label: "Product Color", category: "Common", enabled: true },
    { id: "measurementUnit", label: "Measurement Unit", category: "Common", enabled: false },
  ])

  const handleToggleChange = (id: string, enabled: boolean) => {
    setConfigOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, enabled } : option
      )
    )
  }

  const handleCancel = () => {
    router.push("/home")
  }

  const handleUpdate = () => {
    
    toast.success("Configuration Updated!", {
      description: "Your setup configuration has been saved successfully.",
      duration: 3000,
      position: "top-right",
      
    })
  }

  return (
    <div className="container mx-auto p-6">

      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <span className="text-sm font-medium text-gray-500">PAGES</span>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-sm font-medium text-gray-900">CONFIG</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Setup Config</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Update Setup Config</CardTitle>
          <CardDescription>
            Configure your system settings by toggling the options below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="space-y-4">
              {configOptions.slice(0, 4).map((option) => (
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

            {/* Right Column */}
            <div className="space-y-4">
              {configOptions.slice(4).map((option) => (
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
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Update Info</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
