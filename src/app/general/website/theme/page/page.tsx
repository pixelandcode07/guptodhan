import ThemeColorCard from './Components/ThemeColorCard';
import SectionTitle from '@/components/ui/SectionTitle';

export default async function Page() {
  let colors;
  let themeId = null;

  try {
    const res = await fetch(
      'http://localhost:3000/api/v1/public/theme-settings',
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch theme settings: ${res.status}`);
    }

    const json = await res.json();
    const theme = json?.data;

    if (theme?._id) {
      themeId = theme._id;
    }

    colors = {
      primary: theme?.primaryColor,
      secondary: theme?.secondaryColor,
      tertiary: theme?.tertiaryColor,
      title: theme?.titleColor,
      paragraph: theme?.paragraphColor,
      border: theme?.borderColor,
    };
  } catch (error) {
    console.error('Error fetching theme settings:', error);

    // fallback default colors
    colors = {
      primary: '#00005e',
      secondary: '#3d85c6',
      tertiary: '#ba2a2a',
      title: '#222831',
      paragraph: '#252a34',
      border: '#eeeeee',
    };
  }

  return (
    <div>
      <div className="pt-5 pr-5">
        <SectionTitle text="Update Website Theme Color" />
      </div>

      {/* ✅ Pass themeId dynamically */}
      <ThemeColorCard initialColors={colors} themeId={themeId} />
    </div>
  );
}
