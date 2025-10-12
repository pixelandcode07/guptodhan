// app/(your-path)/FAQS/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';
import FAQSTabile from './Components/FAQSTabile';
import axios from 'axios';

export const revalidate = 0; // optional: disable caching

const fetchFAQS = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/faq`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function FAQS() {
  const faq = await fetchFAQS();
  console.log(faq);
  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="FAQ List" />
      </div>

      <FAQSTabile faq={faq.data} />
    </div>
  );
}
