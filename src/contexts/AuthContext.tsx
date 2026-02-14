// ফাইল পাথ: D:\Guptodhan Project\guptodhan\src\contexts\AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // অপশনাল: টোস্ট মেসেজের জন্য

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'user' | 'vendor' | 'service-provider' | 'admin';
  isVerified: boolean;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pin: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ========================================
  // INITIALIZE AUTH ON MOUNT
  // ========================================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // ১. লোকাল স্টোরেজ থেকে ডাটা নিন
        const storedToken = localStorage.getItem('accessToken'); // 'token' এর বদলে 'accessToken' ব্যবহার করা ভালো
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // ২. যদি টোকেন না থাকে, তবে API কল করে চেক করুন (Cookies check)
          const response = await fetch('/api/v1/profile/me'); // Header ছাড়া কল করুন, ব্রাউজার অটোমেটিক কুকি পাঠাবে
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data);
              // টোকেন যদি রেসপন্সে আসে সেট করুন, নাহলে কুকিতেই থাকবে
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // এরর হলে সব ক্লিয়ার করে দিন
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ========================================
  // LOGIN
  // ========================================
  const login = async (identifier: string, pin: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password: pin }), // আপনার লগইন পেইজে identifier এবং password চাচ্ছে
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const { user, accessToken } = result.data;

      // ৩. ডাটা স্টোর করুন
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(accessToken);
      setUser(user);

      toast.success('Logged in successfully!');
      router.push('/'); // হোমপেজে রিডাইরেক্ট
      router.refresh(); // রাউটার রিফ্রেশ করুন যাতে হেডার আপডেট হয়
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // REGISTER
  // ========================================
  const register = async (data: any) => {
    try {
      setIsLoading(true);
      // রেজিস্ট্রেশন লজিক (আপনার আগের মতোই রাখুন)
      // ...
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // ✅ LOGOUT (FIXED)
  // ========================================
  const logout = async () => {
    try {
      setIsLoading(true);

      // ১. ব্যাকএন্ডে রিকোয়েস্ট পাঠান কুকি ডিলিট করার জন্য
      await fetch('/api/v1/auth/logout', { method: 'POST' });

      // ২. লোকাল স্টোরেজ এবং সেশন স্টোরেজ পুরো ক্লিয়ার করুন
      localStorage.clear();
      sessionStorage.clear();

      // ৩. স্টেট ক্লিয়ার করুন
      setUser(null);
      setToken(null);

      toast.success('Logged out successfully');
      
      // ৪. লগইন পেজে পাঠান এবং পেজ রিফ্রেশ দিন (যাতে সব স্টেট রিসেট হয়)
      router.push('/auth/login');
      router.refresh(); 
      
    } catch (error) {
      console.error('Logout error:', error);
      // এরর হলেও লোকাল ডাটা ক্লিয়ার করুন
      localStorage.clear();
      setUser(null);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // UPDATE USER
  // ========================================
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}