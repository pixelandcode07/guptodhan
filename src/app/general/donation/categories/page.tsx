import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateDonationCategory from "./components/CreateDonationCategory"
import ViewAllDonationCategory from "./components/ViewAllDonationCategory"
// import BrandModelEditionManagement from "./components/BrandModelEditionManagement"
// import ViewAllBrand from "./components/ViewAllBrand"

export default function CategoriesPage() {
    return (
        <div className="w-full mt-10">
            <Tabs defaultValue="view-category">
                {/* Tab Headers */}
                <TabsList className="grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-5">
                    <TabsTrigger value="create">Create Category</TabsTrigger>
                    {/* <TabsTrigger value="sub-create">Create Sub-Category</TabsTrigger> */}
                    <TabsTrigger value="view-category">View All Categories</TabsTrigger>
                </TabsList>

                {/* Create category */}
                <TabsContent value="create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <CreateDonationCategory />
                    </div>
                </TabsContent>
                {/* Create sub category */}
                {/* <TabsContent value="sub-create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <SubCreateCategory />
                    </div>
                </TabsContent> */}

                {/* View all Category */}
                <TabsContent value="view-category" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <ViewAllDonationCategory />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
