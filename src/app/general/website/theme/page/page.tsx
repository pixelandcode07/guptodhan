import axios from 'axios';
import ThemeColorCard from './Components/ThemeColorCard';
import SectionTitle from '@/components/ui/SectionTitle';

const fatchColor = async () => {
  const baseUrl = process.env.NEXTAUTH_URL;
  try {
    const { data } = await axios.get(`${baseUrl}/api/v1/public/theme-settings`);

    return data;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
  }
};
export default async function Page() {
  const colors = await fatchColor();

  return (
    <div>
      <div className="pt-5 pr-5">
        <SectionTitle text="Update Website Theme Color" />
      </div>

      {/* ✅ Pass themeId dynamically */}
      <ThemeColorCard initialColors={colors.data || {}} />
    </div>
  );
}
