// 'use client'

// import { Button } from '@/components/ui/button'
// import { signIn, useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import React, { useEffect } from 'react'
// import { toast } from 'sonner'


// export default function SocialLoginPart() {

//     const session = useSession()
//     const route = useRouter()

//     const getRedirectUrl = () => {
//         const saved = localStorage.getItem('redirectAfterLogin')
//         if (saved && saved !== '/') return saved
//         return '/' // fallback
//     }



//     const handleSocialLogin = async (providerName: string) => {
//         // Logic to handle social login using provider
//         // console.log(`SOCIAL LOGIN: ${providerName}`);

//         try {
//             const result = await signIn(providerName, { callbackUrl: `${window.location.origin}` })
//             // redirect: false,
//             if (result?.error) {
//                 toast('Something went wrong')
//             }
//         } catch (error) {
//             toast('Something went wrong')
//         }
//     }


//     useEffect(() => {
//         if (session?.status == "authenticated") {
//             toast("Login successfully");
//             route.push("/")
//         }
//     }, [session?.status, route])


//     return (
//         <>
//             <Button
//                 onClick={() => handleSocialLogin("google")}
//                 variant="outline" className="w-full flex-1">
//                 <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,9.999,10c6.078,0,10.004-4.926,10.004-10c0-0.171-0.005-0.339-0.014-0.507c-0.588-0.1-1.127-0.252-1.718-0.444v0.444H12.545z" />
//                 </svg>
//                 Google
//             </Button>
//             <Button
//                 onClick={() => handleSocialLogin("facebook")}
//                 variant="outline" className="w-full flex-1">
//                 <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                 </svg>
//                 Facebook
//             </Button>
//         </>
//     )
// }




'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

export default function SocialLoginPart() {
  // যেখান থেকে user login করতে চায়, সেটা নিয়ে নিবে
  const getCallbackUrl = () => {
    const saved = localStorage.getItem('redirectAfterLogin')
    if (saved && saved !== '/' && saved !== '/login') {
      return saved
    }
    // যদি কোনো saved না থাকে, তাহলে current page এ থাকবে
    return window.location.pathname + window.location.search || '/'
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const callbackUrl = getCallbackUrl()
      
      // এটাই মূল কাজ করে — NextAuth এই URL এ redirect করবে
      await signIn(provider, {
        callbackUrl,        // এটাই সবচেয়ে জরুরি
        redirect: true,     // এটা true রাখো (false করলে কাজ করবে না)
      })
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <Button
        onClick={() => handleSocialLogin('google')}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 hover:border-gray-400 transition font-medium"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 6.75c1.63 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Google
      </Button>

      <Button
        onClick={() => handleSocialLogin('facebook')}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 hover:border-gray-400 transition font-medium"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </Button>
    </div>
  )
}