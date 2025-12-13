import axios from 'axios';
import { signOut } from 'next-auth/react';

const api = axios.create({
  baseURL: '/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor: সব API কলের রেসপন্স এখানে চেক করা হবে
api.interceptors.response.use(
  (response) => {
    // সফল রেসপন্সের জন্য কোনো পরিবর্তন ছাড়াই রিটার্ন করা হচ্ছে
    return response;
  },
  (error) => {
    // যদি সার্ভার থেকে 401 Unauthorized error আসে
    if (error.response?.status === 401) {
      console.log('Session expired or invalid. Signing out...');
      
      // NextAuth-এর signOut ফাংশন কল করে ইউজারকে লগআউট করা হচ্ছে
      // এবং লগইন পেজে রিডাইরেক্ট করা হচ্ছে
      signOut({ callbackUrl: '/' }); 
    }
    
    // অন্যান্য সব error-এর জন্য সেটিকে reject করা হচ্ছে
    return Promise.reject(error);
  }
);

export default api;