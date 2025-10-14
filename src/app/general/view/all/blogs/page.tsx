import axios from 'axios';
import BlogTable from './Components/BlogTable';

const fetchBLogs = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/blog`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function BlogPage() {
  const blogs = await fetchBLogs();
  console.log(blogs);
  return (
    <div className="min-h-screen bg-gray-50">
      <BlogTable blogs={blogs.data} />
    </div>
  );
}
