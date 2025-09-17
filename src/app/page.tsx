'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ServiceCreationTestPage() {
  const [token, setToken] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Fetch all service categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/v1/public/service-categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch sub-categories when a parent category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSelectedSubCategory('');
      return;
    }
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(`/api/v1/public/service-categories/${selectedCategory}/subcategories`);
        if (res.data.success) {
          setSubCategories(res.data.data);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch sub-categories:", error);
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert('Please provide a Service Provider Access Token.');
      return;
    }
    setIsLoading(true);
    setApiResponse(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Manually set category and subCategory from state as shadcn Select doesn't add to FormData directly
    formData.set('category', selectedCategory);
    if(selectedSubCategory) {
        formData.set('subCategory', selectedSubCategory);
    }

    try {
      const response = await axios.post('/api/v1/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setApiResponse({ success: true, data: response.data });
      alert('Service created successfully!');
      form.reset();
      setSelectedCategory('');
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      setApiResponse({ success: false, data: error.response?.data || { message: error.message } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Create a New Service</h1>
            <p className="text-gray-500 mt-2">Test the protected service creation endpoint.</p>
        </div>

        <Card className="bg-yellow-50 border-yellow-300">
            <CardContent className="pt-6">
                 <Label htmlFor="token-input" className="font-bold text-yellow-800">Service Provider Access Token</Label>
                 <Input
                    id="token-input"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Login as a provider and paste the token here..."
                    className="mt-2 bg-white"
                 />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div><Label htmlFor="title">Service Title</Label><Input id="title" name="title" placeholder="e.g., Professional AC Repair" required /></div>
              
              <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="Describe your service..." required /></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label htmlFor="price">Price (BDT)</Label><Input id="price" name="price" type="number" placeholder="1200" required /></div>
                <div><Label htmlFor="category">Service Category</Label>
                  <Select onValueChange={setSelectedCategory} required>
                      <SelectTrigger><SelectValue placeholder="-- Select a Category --" /></SelectTrigger>
                      <SelectContent>
                          {categories.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
                </div>
              </div>

              {subCategories.length > 0 && <div>
                  <Label htmlFor="subCategory">Sub-Category (Optional)</Label>
                  <Select onValueChange={setSelectedSubCategory}>
                      <SelectTrigger><SelectValue placeholder="-- Select a Sub-Category --" /></SelectTrigger>
                      <SelectContent>
                          {subCategories.map(sub => <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>}
              
              <div><Label htmlFor="location">Location (JSON Format)</Label><Input id="location" name="location" placeholder='{"division":"Dhaka", "district":"Dhaka", "upazila":"Gulshan"}' required /></div>

              <div><Label>Service Images (select multiple)</Label><Input name="images" type="file" multiple required /></div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Service...' : 'Create Service'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {apiResponse && (
          <Card>
            <CardHeader><CardTitle>API Response</CardTitle></CardHeader>
            <CardContent>
              <pre className={`p-4 rounded-lg text-sm whitespace-pre-wrap min-h-[100px] ${apiResponse.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}