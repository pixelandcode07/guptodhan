import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateCategory from "./components/CreateCategory"
import ViewAllCategory from "./components/ViewAllCategory"
import SubCreateCategory from "./components/SubCreateCategory"
import BrandModelEditionManagement from "./components/BrandModelEditionManagement"
import ViewAllBrand from "./components/ViewAllBrand"

export default function CategoriesPage() {
    return (
        <div className="w-full mt-10">
            <Tabs defaultValue="view-category">
                {/* Tab Headers */}
                <TabsList className="grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-5">
                    <TabsTrigger value="create">Create Category</TabsTrigger>
                    <TabsTrigger value="sub-create">Create Sub-Category</TabsTrigger>
                    {/* <TabsTrigger value="brand-model-edition">Brand-Model-Edition</TabsTrigger> */}
                    <TabsTrigger value="view-category">View All Categories</TabsTrigger>
                    {/* <TabsTrigger value="view-brands">View All Brands</TabsTrigger> */}
                </TabsList>

                {/* Create category */}
                <TabsContent value="create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <CreateCategory />
                    </div>
                </TabsContent>
                {/* Create sub category */}
                <TabsContent value="sub-create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <SubCreateCategory />
                    </div>
                </TabsContent>
                {/* Create Brand Model Edition */}
                {/* <TabsContent value="brand-model-edition" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <BrandModelEditionManagement />
                    </div>
                </TabsContent> */}

                {/* View all Category */}
                <TabsContent value="view-category" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <ViewAllCategory />
                    </div>
                </TabsContent>
                {/* View all vendor */}
                {/* <TabsContent value="view-brands" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <ViewAllBrand />
                    </div>
                </TabsContent> */}
            </Tabs>
        </div>
    )
}
