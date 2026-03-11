import React from 'react';
import JobManagementClient from './Components/jobManagementCliient';

// SEO / Meta tags (যেহেতু এটি Server Component)
export const metadata = {
  title: 'Manage Jobs | Guptodhan Admin',
  description: 'Admin panel to manage all job posts',
};

export default function AdminJobsPage() {
  return (
    <>
      <JobManagementClient />
    </>
  );
}