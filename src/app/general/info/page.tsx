import axios from 'axios';
import GeneralInfoForm from './Components/GeneralInfoForm';

const fetchSettings = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;

    const { data } = await axios.get(`${baseUrl}/api/v1/public/settings`);

    return data;
  } catch (error) {
    console.log('fatch settings Error', error);
  }
};

export default async function GeneralInfoPage() {
  const settings = await fetchSettings();
  // console.log(settings);

  return (
    <div className="min-h-screen pt-5 bg-gray-50">
      <div className="bg-white shadow rounded">
        <GeneralInfoForm data={settings.data || {}} />
      </div>
    </div>
  );
}
