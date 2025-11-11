import { Input } from '@/components/ui/input'
import React from 'react'
import { Inputs } from '@/types/Inputs'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

export default function StoreSocialLinks({ register, errors }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
}) {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Social Links:</h1>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                {/* Facebook */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="facebook_url" className="pb-2">Facebook</Label> */}
                    <Input
                        type="url"
                        placeholder="https://facebook.com/yourpage"
                        {...register("facebook_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.facebook_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.facebook_url.message}</span>
                    )}
                </section>

                {/* Whatsapp */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="whatsapp_url" className="pb-2">Whatsapp</Label> */}
                    <Input
                        type="url"
                        placeholder="https://wa.me/your-number"
                        {...register("whatsapp_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.whatsapp_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.whatsapp_url.message}</span>
                    )}
                </section>

                {/* Instagram */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="instagram_url" className="pb-2">Instagram</Label> */}
                    <Input
                        type="url"
                        placeholder="https://instagram.com/yourpage"
                        {...register("instagram_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.instagram_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.instagram_url.message}</span>
                    )}
                </section>

                {/* Linkedin */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="linkedin_url" className="pb-2">Linkedin</Label> */}
                    <Input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...register("linkedin_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.linkedin_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.linkedin_url.message}</span>
                    )}
                </section>

                {/* Twitter */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="twitter_url" className="pb-2">Twitter</Label> */}
                    <Input
                        type="url"
                        placeholder="https://twitter.com/yourhandle"
                        {...register("twitter_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.twitter_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.twitter_url.message}</span>
                    )}
                </section>

                {/* TikTok */}
                <section className="flex flex-col">
                    {/* <Label htmlFor="tiktok_url" className="pb-2">TikTok</Label> */}
                    <Input
                        type="url"
                        placeholder="https://tiktok.com/@yourprofile"
                        {...register("tiktok_url", {
                            pattern: {
                                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                message: "URL must be valid",
                            },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.tiktok_url && (
                        <span className="text-red-600 text-sm mt-1">{errors.tiktok_url.message}</span>
                    )}
                </section>
            </main>

        </>
    )
}

