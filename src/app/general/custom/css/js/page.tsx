// app/custom-code/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';
import CodeSnippet from './Components/CodeSnipate';
import axios from 'axios';

const fetchCodes = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;

    const { data } = await axios.get(`${baseUrl}/api/v1/public/custom-code`);

    return data;
  } catch (error) {
    console.log('fatch settings Error', error);
  }
};

export default async function Page() {
  const codeData = await fetchCodes();
  console.log(codeData);

  return (
    <div className="p-6 space-y-6">
      <SectionTitle text="Custom CSS & JS Form" />
      <CodeSnippet initialData={codeData.data} />
    </div>
  );
}
