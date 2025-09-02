import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

export default function Attachment() {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Attachments:</h1>
            <Label htmlFor="picture">Upload Owner NID card</Label>
            <Input id="picture" type="file" />
            <Label htmlFor="picture">Upload Business Trade License</Label>
            <Input id="picture" type="file" />
        </>
    )
}
