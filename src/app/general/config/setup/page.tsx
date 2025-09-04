import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConfigSetupClient from "@/components/TableHelper/ConfigSetupClient"

export type ConfigOption = {
  id: string
  label: string
  category: string
  enabled: boolean
}

export default function GeneralConfigSetupPage() {
  const initialOptions: ConfigOption[] = [
    { id: "storage", label: "Storage", category: "Tech", enabled: true },
    { id: "simType", label: "Sim Type", category: "Tech", enabled: true },
    { id: "deviceCondition", label: "Device Condition", category: "Tech", enabled: true },
    { id: "productWarranty", label: "Product Warranty", category: "Tech", enabled: true },
    { id: "productSize", label: "Product Size", category: "Fashion", enabled: true },
    { id: "region", label: "Region", category: "Common", enabled: true },
    { id: "productColor", label: "Product Color", category: "Common", enabled: true },
    { id: "measurementUnit", label: "Measurement Unit", category: "Common", enabled: false },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Setup Config</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Update Setup Config</CardTitle>
          <CardDescription>
            Configure your system settings by toggling the options below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigSetupClient initialOptions={initialOptions} />
        </CardContent>
      </Card>
    </div>
  )
}