import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateCategory from "./components/CreateCategory"
import ViewAllCategory from "./components/ViewAllCategory"

export default function CategoriesPage() {
    return (
        <div className="w-full mt-10">
            <Tabs defaultValue="view">
                {/* Tab Headers */}
                <TabsList className="grid max-w-xl grid-cols-2">
                    <TabsTrigger value="create">Create Category</TabsTrigger>
                    <TabsTrigger value="view">View All Categories</TabsTrigger>
                </TabsList>

                {/* Create */}
                <TabsContent value="create" className="mt-6">
                    <div className="space-y-4 p-6 border rounded-md shadow-sm bg-white">
                        <CreateCategory />
                    </div>
                </TabsContent>

                {/* View */}
                <TabsContent value="view" className="mt-6">
                    <ViewAllCategory />
                </TabsContent>
            </Tabs>
        </div>
    )
}
