import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRedirectAfterLogin() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const redirectTo = localStorage.getItem('redirectAfterLogin');

            if (redirectTo && redirectTo !== '/' && redirectTo !== '/login') {
                localStorage.removeItem('redirectAfterLogin');
                router.replace(redirectTo);
            }
        }
    }, [status, router]);
}