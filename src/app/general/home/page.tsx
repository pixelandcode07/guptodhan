/* eslint-disable @typescript-eslint/no-explicit-any */
// ফাইল পাথ: src/app/page.tsx

"use client"; // <-- খুবই গুরুত্বপূর্ণ: এটি কম্পোনেন্টটিকে একটি ক্লায়েন্ট কম্পোনেন্ট বানায়

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // <-- next/image ব্যবহার করা হচ্ছে পারফর্মেন্সের জন্য

// Main component
export default function HomePage() {
  // --- State Management ---
  const [apiResponse, setApiResponse] = useState<any>({ message: "API response will be shown here." });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // --- API Call Functions ---

  // ১. সকল টিম মেম্বার নিয়ে আসার ফাংশন
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/public/about/team');
      const data = await res.json();
      if (data.success) {
        setTeamMembers(data.data);
      } else {
        setApiResponse(data);
      }
    } catch (error: any) {
      setApiResponse({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // কম্পোনেন্ট লোড হওয়ার সাথে সাথেই ডেটা নিয়ে আসা হবে
  useEffect(() => {
    const storedToken = localStorage.getItem('adminAccessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
    fetchTeamMembers();
  }, []);
  
  // ২. অ্যাডমিন লগইন করার ফাংশন
  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setApiResponse(data);
      if (data.success && data.data.accessToken && data.data.user.role === 'admin') {
        const token = data.data.accessToken;
        setAccessToken(token);
        localStorage.setItem('adminAccessToken', token);
        alert('Admin login successful!');
      } else {
        alert(`Login failed: ${data.message || 'Not an admin account.'}`);
      }
    } catch (error: any) {
      setApiResponse({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ৩. নতুন টিম মেম্বার তৈরি করার ফাংশন
  const handleCreateMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
        alert("Please log in as an admin first.");
        return;
    }
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
        const res = await fetch('http://localhost:3000/api/v1/about/team', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await res.json();
        setApiResponse(data);
        if(data.success) {
            alert('Team member added successfully!');
            fetchTeamMembers(); // তালিকাটি রিফ্রেশ করা হচ্ছে
            (event.target as HTMLFormElement).reset();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error: any) {
        setApiResponse({ success: false, message: error.message });
    } finally {
        setIsLoading(false);
    }
  };
  
  // ৪. টিম মেম্বার ডিলিট করার ফাংশন
  const handleDeleteMember = async (memberId: string) => {
    if (!accessToken) {
        alert("Please log in as an admin first.");
        return;
    }
    if (!window.confirm("Are you sure you want to delete this team member?")) {
        return;
    }
    setIsLoading(true);
    try {
        const res = await fetch(`http://localhost:3000/api/v1/about/team/${memberId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setApiResponse(data);
        if(data.success) {
            alert('Team member deleted successfully!');
            fetchTeamMembers(); // তালিকাটি রিফ্রেশ করা হচ্ছে
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error: any) {
        setApiResponse({ success: false, message: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  // --- JSX for the UI ---
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">About Us - Team Management</h1>
          <p className="text-gray-600 mt-2">A frontend to test the Team Member API.</p>
        </header>

        {/* API Response Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">API Response</h2>
          <pre className="bg-gray-800 text-white p-4 rounded-lg shadow-inner text-sm overflow-x-auto min-h-[100px]">
             {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section for Admin Panel */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">1. Admin Login (Required)</h3>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input name="email" type="email" placeholder="Admin Email" defaultValue="admin@example.com" className="w-full p-3 border rounded-md" required />
                <input name="password" type="password" placeholder="Admin Password" defaultValue="adminpassword123" className="w-full p-3 border rounded-md" required />
                <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400">
                  {isLoading ? 'Logging in...' : 'Login as Admin'}
                </button>
                {accessToken && <p className="text-green-600 font-semibold mt-2">✅ Access Token Acquired!</p>}
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">2. Add New Team Member</h3>
              <form onSubmit={handleCreateMember} className="space-y-4">
                <input name="name" placeholder="Member Name" className="w-full p-3 border rounded-md" required />
                <input name="designation" placeholder="Designation (e.g., Lead Developer)" className="w-full p-3 border rounded-md" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Image (Required):</label>
                  <input name="image" type="file" required accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"/>
                </div>
                 <input name="socialLinks.linkedin" placeholder="LinkedIn URL (Optional)" className="w-full p-3 border rounded-md" />
                 <input name="socialLinks.github" placeholder="GitHub URL (Optional)" className="w-full p-3 border rounded-md" />
                <button type="submit" disabled={isLoading || !accessToken} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400">
                  {isLoading ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          </div>

          {/* Section for Displaying Team Members */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">3. Our Team</h3>
            <button onClick={fetchTeamMembers} className="w-full mb-4 bg-gray-200 p-2 rounded-md hover:bg-gray-300">Refresh Team List</button>
            {isLoading && teamMembers.length === 0 ? <p>Loading team members...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                {teamMembers.length > 0 ? teamMembers.map(member => (
                  <div key={member._id} className="relative group p-3 border rounded-md shadow-sm bg-gray-50 text-center">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover mx-auto mb-2 border-2 border-gray-200"
                      />
                      <h4 className="font-bold text-gray-800">{member.name}</h4>
                      <p className="text-sm text-purple-600">{member.designation}</p>
                      <button 
                        onClick={() => handleDeleteMember(member._id)}
                        disabled={isLoading || !accessToken}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition disabled:hidden"
                        title="Delete Member"
                      >
                        X
                      </button>
                  </div>
                )) : <p className="text-gray-500 col-span-2 text-center py-10">No team members found.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}