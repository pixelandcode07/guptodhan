import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm';
import axios from 'axios';

const fetchAbout = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;

    const { data } = await axios.get(`${baseUrl}/api/v1/public/about/content`);

    return data;
  } catch (error) {
    console.log('fatch settings Error', error);
  }
};

export default async function Page() {
  const aboutData = await fetchAbout();
  console.log('aboutData', aboutData);

  return (
    <div className="bg-white pt-5 px-4">
      <SectionTitle text="General Information Form" />
      <AboutUsForm aboutData={aboutData.data} />
    </div>
  );
}
