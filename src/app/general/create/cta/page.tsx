import axios from 'axios';
import CTAForm from './Components/CTAForm';

export default async function CTAPage() {
  // Server-side data fetch
  let ctaData = null;
  try {
    const res = await axios.get(
      'http://localhost:3000/api/v1/public/about/cta'
    );
    if (res.data.success) {
      ctaData = res.data.data;
    }
  } catch (error) {
    console.error('Error fetching CTA data:', error);
  }

  return <CTAForm initialData={ctaData} />;
}
