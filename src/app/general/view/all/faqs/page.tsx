// app/(your-path)/FAQS/page.tsx
import SectionTitle from '@/components/ui/SectionTitle';
import FAQSTabile from './Components/FAQSTabile';
import axios from 'axios';

export const revalidate = 0; // optional: disable caching

export default async function FAQS() {
  let faq: any[] = [];

  try {
    const res = await axios.get('http://localhost:3000/api/v1/faq');
    if (res.data?.success) {
      faq = res.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
  }
console.log(faq)
  return (
    <div className="bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <SectionTitle text="FAQ List" />
      </div>

      <FAQSTabile faq={faq} />
    </div>
  );
}
