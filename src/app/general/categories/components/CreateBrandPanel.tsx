import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brand, CreateBrandForm, createBrandSchema } from './BrandModelEditionManagement';
import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';
import { Button } from '@/components/ui/button';


interface CreateBrandPanelProps {
    brands: Brand[];
    selectedBrand: Brand | null;
    onBrandSelected: (brand: Brand) => void;
    onBrandCreated: (newBrand: Brand) => void;
    token: string | undefined;
    userRole: string | undefined;
    fetchBrands: () => Promise<void>;
}

export default function CreateBrandPanel({
    brands,
    selectedBrand,
    onBrandSelected,
    onBrandCreated,
    token,
    userRole,
    fetchBrands,
}: CreateBrandPanelProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const form = useForm<CreateBrandForm>({
        resolver: zodResolver(createBrandSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: CreateBrandForm) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        setLoading(true);
        try {
            const res = await axios.post("/api/v1/brands", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                    "x-user-role": userRole,
                },
            });
            const newBrand = res.data.data;
            form.reset();
            setLogoFile(null);
            await fetchBrands();
            onBrandCreated(newBrand);
            setError(null);
        } catch (err) {
            setError('Error creating brand');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (file: File | null) => {
        setLogoFile(file);
    };

    const handleLogoRemove = () => {
        setLogoFile(null);
    };

    if (loading && brands.length === 0) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Management</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
                    <div>
                        <Input
                            {...form.register('name')}
                            placeholder="Brand Name"
                            className="w-full"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <UploadImageBtn
                        value={logoFile}
                        onChange={handleLogoChange}
                        onRemove={handleLogoRemove}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Brand'}
                    </Button>
                </form>

                <ul className="space-y-2">
                    {brands.map((brand) => (
                        <li
                            key={brand._id}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => onBrandSelected(brand)}
                        >
                            {brand.logo && (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 mr-3 rounded"
                                />
                            )}
                            <span className="flex-1 cursor-pointer hover:underline">{brand.name}</span>
                            {selectedBrand?._id === brand._id && <span className="text-sm text-blue-500 ml-2">Selected</span>}
                        </li>
                    ))}
                </ul>
                {brands.length === 0 && <p className="text-gray-500 text-center py-4">No brands found.</p>}
            </CardContent>
        </Card>
    );
}