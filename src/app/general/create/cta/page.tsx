import CTAForm from './Components/CTAForm';
import axios from 'axios';

const fetchCta = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const { data } = await axios.get(`${baseUrl}/api/v1/public/about/cta`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function CTAPage() {
  const ctaData = await fetchCta();
  console.log(ctaData);
  return <CTAForm initialData={ctaData.data || {}} />;
}
