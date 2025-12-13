import { BlogServices } from '@/lib/modules/blog/blog.service'; // ✅ Import your service directly
import dbConnect from '@/lib/db'; // ✅ Import your database connection
import BlogTable from './Components/BlogTable';

// This is now an async Server Component
export default async function BlogPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  // Fetch all blogs by passing an empty filter object
  const blogsData = await BlogServices.getAllBlogsFromDB({}); 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass the fetched data as a prop to the client component.
        JSON.parse(JSON.stringify(...)) converts the Mongoose document
        to a plain object, which is safe to pass from Server to Client Components.
      */}
      <BlogTable initialBlogs={JSON.parse(JSON.stringify(blogsData))} />
    </div>
  );
}