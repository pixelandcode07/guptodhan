"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import axios from "axios";

type FormData = {
  brand: string;
  modelName: string;
  modelCode: string;
};

// Static brand list as shown in the image
const brands = [
  "Acer",
  "AMD", 
  "Apple",
  "Asus",
  "awei",
  "BAJAJ",
  "BOYA",
  "Canon",
  "DJI",
  "GODEX",
  "GoPro",
  "GUCCI",
  "havit",
  "Honor",
  "HP",
  "HUAWEI",
  "IBM",
  "JAMUNA",
  "LG",
  "Microsoft",
  "Nike",
  "Nokia",
  "OnePlus",
  "Samsung",
  "Sony",
  "Xiaomi"
];

export default function ModelForm() {
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [formData, setFormData] = useState<FormData>({
    brand: "",
    modelName: "",
    modelCode: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        brand: formData.brand,
        modelName: formData.modelName,
        modelCode: formData.modelCode,
        modelFormId: formData.modelName.toLowerCase().replace(/\s+/g, "-"),
        status: "active"
      };

      await axios.post("/api/v1/product-config/modelName", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Model created successfully!");
      
      // Redirect to models table
      window.location.href = "/general/view/all/models";
    } catch (error) {
      toast.error("Failed to create model");
      console.error("Error creating model:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-5 p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Model</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500"></div>
            Model Create Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Brand Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="brand" className="text-right">
                Brand *
              </Label>
              <div className="md:col-span-2">
                <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Model Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="modelName" className="text-right">
                Model Name *
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="modelName"
                  value={formData.modelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                  placeholder="Model Name"
                  required
                />
              </div>
            </div>

            {/* Model Code Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="modelCode" className="text-right">
                Model Code *
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="modelCode"
                  value={formData.modelCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelCode: e.target.value }))}
                  placeholder="Model Code"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Creating..." : "Save Model"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
