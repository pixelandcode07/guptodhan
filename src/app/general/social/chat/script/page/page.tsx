'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import React from 'react'

export default function SocialLoginPart() {

    const handleSocialLogin = async (providerName: string) => {
        try {
            // ✅ FIX: signIn ফাংশনটি নিজেই রিডাইরেকশনের কাজটি করবে।
            // সফলভাবে লগইন হলে এটি callbackUrl-এ পাঠিয়ে দেবে।
            const result = await signIn(providerName, {
                redirect: true, // নিশ্চিত করুন এটি true আছে (ডিফল্ট)
                callbackUrl: '/', // লগইন সফল হওয়ার পর হোম পেজে যাবে
            });

            // যদি কোনো কারণে redirect না হয় এবং error থাকে
            if (result?.error) {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred during login.");
        }
    }

    // ✅ FIX: যে useEffect টি সমস্যা করছিল, সেটি মুছে ফেলা হয়েছে।

    return (
        <>
            <Button
                onClick={() => handleSocialLogin("google")}
                variant="outline" className="w-full flex-1">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,9.999,10c6.078,0,10.004-4.926,10.004-10c0-0.171-0.005-0.339-0.014-0.507c-0.588-0.1-1.127-0.252-1.718-0.444v0.444H12.545z" />
                </svg>
                Google
            </Button>
            <Button
                onClick={() => handleSocialLogin("facebook")}
                variant="outline" className="w-full flex-1">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
            </Button>
        </>
    )
}