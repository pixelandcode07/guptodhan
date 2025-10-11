// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter, useParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function BrandEdit() {
//     const router = useRouter();
//     const params = useParams();
//     const brandId = params?.id as string;

//     const [brand, setBrand] = useState<any>(null);
//     const [selectedModel, setSelectedModel] = useState<any>(null);
//     const [modelName, setModelName] = useState("");
//     const [loading, setLoading] = useState(true);

//     // 🟡 Fetch brand + models
//     useEffect(() => {
//         const fetchBrand = async () => {
//             try {
//                 const res = await axios.get(`/api/v1/public/brands/${brandId}`);
//                 const fetchedBrand = res.data.data;

//                 // Fetch models of this brand
//                 const modelRes = await axios.get(`/api/v1/product-models?brandId=${brandId}`);
//                 fetchedBrand.models = modelRes.data.data || [];

//                 setBrand(fetchedBrand);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (brandId) fetchBrand();
//     }, [brandId]);

//     // 🟢 Select model to edit
//     const handleSelectModel = (model: any) => {
//         setSelectedModel(model);
//         setModelName(model.name);
//     };

//     // 🟢 Update selected model
//     const handleUpdateModel = async () => {
//         try {
//             await axios.patch(`/api/v1/product-models/${selectedModel._id}`, {
//                 name: modelName,
//                 brandId,
//             });
//             alert("Model updated successfully!");
//             router.refresh();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update model");
//         }
//     };

//     // 🔴 Delete selected model
//     const handleDeleteModel = async (modelId: string) => {
//         if (!confirm("Are you sure you want to delete this model?")) return;
//         try {
//             await axios.delete(`/api/v1/product-models/${modelId}`);
//             alert("Model deleted successfully!");
//             router.refresh();
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete model");
//         }
//     };

//     if (loading) return <p className="p-6">Loading...</p>;
//     if (!brand) return <p className="p-6 text-red-500">Brand not found</p>;

//     return (
//         <div className="p-6 space-y-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Edit Models under {brand.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {brand.models.length === 0 ? (
//                         <p className="text-gray-500">No models found</p>
//                     ) : (
//                         brand.models.map((model: any) => (
//                             <div
//                                 key={model._id}
//                                 className="flex justify-between items-center border p-3 rounded-md"
//                             >
//                                 <span>{model.name}</span>
//                                 <div className="flex gap-2">
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => handleSelectModel(model)}
//                                     >
//                                         Edit
//                                     </Button>
//                                     <Button
//                                         variant="destructive"
//                                         size="sm"
//                                         onClick={() => handleDeleteModel(model._id)}
//                                     >
//                                         Delete
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Edit section */}
//             {selectedModel && (
//                 <Card className="mt-6">
//                     <CardHeader>
//                         <CardTitle>Edit Model: {selectedModel.name}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                         <div>
//                             <Label>Model Name</Label>
//                             <Input
//                                 value={modelName}
//                                 onChange={(e) => setModelName(e.target.value)}
//                                 placeholder="Enter new model name"
//                             />
//                         </div>
//                         <Button onClick={handleUpdateModel}>Update Model</Button>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

interface Edition {
    _id: string;
    name: string;
}

interface Model {
    _id: string;
    name: string;
    editions: Edition[];
}

interface Brand {
    _id: string;
    name: string;
    logo?: string;
    models: Model[];
}

export default function BrandEditPage() {
    const params = useParams();
    const router = useRouter();
    const brandId = params.id as string;

    const { data: session } = useSession();
    const token = (session?.user as { accessToken?: string })?.accessToken;
    const role = (session?.user as { role?: string })?.role;

    const [brand, setBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [editModelName, setEditModelName] = useState("");

    // ✅ Fetch brand details
    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const { data } = await axios.get(`/api/v1/public/brands/${brandId}`);
                const brandData: Brand = data.data;

                // Fetch models & editions
                for (const model of brandData.models) {
                    const modelRes = await axios.get(`/api/v1/product-models?brandId=${brandData._id}`);
                    model.editions = modelRes.data.data.find((m: Model) => m._id === model._id)?.editions || [];
                }

                setBrand(brandData);
            } catch (err) {
                console.error("Error fetching brand:", err);
            }
        };

        fetchBrand();
    }, [brandId]);

    // ✅ Select model for editing
    const handleSelectModel = (model: Model) => {
        setSelectedModel(model);
        setEditModelName(model.name);
    };

    // ✅ Update specific model
    const handleUpdateModel = async () => {
        if (!selectedModel) return alert("Select a model first!");

        try {
            await axios.patch(
                `/api/v1/product-models/${selectedModel._id}`,
                { name: editModelName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-user-role": role,
                    },
                }
            );

            alert("Model updated successfully!");
            router.refresh();
        } catch (err) {
            console.error("Error updating model:", err);
            alert("Failed to update model");
        }
    };

    // ✅ Delete specific model
    const handleDeleteModel = async (modelId: string) => {
        if (!confirm("Are you sure you want to delete this model?")) return;

        try {
            await axios.delete(`/api/v1/product-models/${modelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-user-role": role,
                },
            });
            alert("Model deleted successfully!");
            router.refresh();
        } catch (err) {
            console.error("Error deleting model:", err);
            alert("Failed to delete model");
        }
    };

    if (!brand) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Brand: {brand.name}</h1>

            <div className="space-y-6">
                {brand.models.map((model) => (
                    <div key={model._id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">{model.name}</h2>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSelectModel(model)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteModel(model._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        {model.editions.length > 0 && (
                            <ul className="mt-2 ml-4 list-disc text-sm">
                                {model.editions.map((edition) => (
                                    <li key={edition._id}>{edition.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for editing model name */}
            {selectedModel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
                        <h2 className="font-semibold mb-2">
                            Editing Model: {selectedModel.name}
                        </h2>
                        <Input
                            value={editModelName}
                            onChange={(e) => setEditModelName(e.target.value)}
                            placeholder="Enter new model name"
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <Button variant="outline" onClick={() => setSelectedModel(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateModel}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
