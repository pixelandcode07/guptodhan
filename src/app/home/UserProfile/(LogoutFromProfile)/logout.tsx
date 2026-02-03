
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Logout() {
    return (
        <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 rounded font-medium"
        >
            <LogOut size={16} />
            Logout
        </button>
    )
}
