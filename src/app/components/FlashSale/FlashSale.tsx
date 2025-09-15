"use client"

import PageHeader from '@/components/ReusableComponents/PageHeader'
import React from 'react'

export default function FlashSale() {
    return (
        <div>
            <PageHeader
                title="Flash Sale"
                buttonLabel="Add Feature"
                onButtonClick={() => console.log("Add Feature clicked")}
            />
        </div>
    )
}
