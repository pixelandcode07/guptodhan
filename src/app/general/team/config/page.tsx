'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

export default function TeamConfigForm() {
  return (
    <form className="space-y-6 p-5">
      <div className="grid grid-cols-1 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue="Meet Our Leaders test"
              placeholder="Meet Our Leaders"
              required
              className="w-full"
            />
            <p className="text-sm text-red-500 mt-1">{/* error */}</p>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              name="short_description"
              rows={9}
              defaultValue={
                'Nunc id cursus metus aliquam. Libero id faucibus nisl tincidunt eget. Aliquam\nmaecenas ultricies mi eget mauris. Volutpat ac  test'
              }
              placeholder="Enter Short Description Here"
              className="w-full"
            />
            <p className="text-sm text-red-500 mt-1">{/* error */}</p>
          </div>
        </div>

        {/* Right: Status */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="1" required>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-red-500 mt-1">{/* error */}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <Button asChild variant="destructive" className="w-[130px]">
          <a
            href="https://app-area.guptodhan.com/home"
            className="flex items-center justify-center gap-1">
            <i className="mdi mdi-cancel" /> Cancel
          </a>
        </Button>

        <Button
          type="submit"
          className="w-[140px] flex items-center justify-center gap-1">
          <i className="fas fa-save" /> Update Info
        </Button>
      </div>
    </form>
  );
}
