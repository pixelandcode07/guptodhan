
import React from 'react'
import BuySellCreateForm from './components/BuySellCreateForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ViewBuySellCategories from '@/app/general/view/buy/sell/categories/page'

export default function BySellCategory() {
    return (
        <>
            <Tabs defaultValue="create" className="w-full mt-10">
                {/* Tab Headers */}
                <TabsList className="grid max-w-xl grid-cols-2">
                    <TabsTrigger value="create">Create Category</TabsTrigger>
                    <TabsTrigger value="view">View All Categories</TabsTrigger>
                </TabsList>

                {/* Create Category */}
                <TabsContent value="create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <BuySellCreateForm />
                    </div>
                </TabsContent>

                {/* View Categories */}
                <TabsContent value="view" className="mt-6">
                    <ViewBuySellCategories />
                </TabsContent>
            </Tabs>
        </>
    )
}
