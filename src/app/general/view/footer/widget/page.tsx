import TabsLayout from '@/components/ReusableComponents/TabsLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import SocialLinks from './Components/Social_links';
import FooterWidget1 from './Components/Wideget_1';
import FooterWidget2 from './Components/Wideget_2';
import FooterWidget3 from './Components/Wideget_3';

// Dynamic import for performance

export default function SocialLoginSettings() {
  const tabItems = [
    { value: 'fw1', label: 'Footer Widget 1', content: <FooterWidget1 /> },
    {
      value: 'fw2',
      label: 'Footer Widget 2',
      content: <FooterWidget2 />,
    },
    {
      value: 'fw3',
      label: 'Footer Widget 3',
      content: <FooterWidget3 />,
    },
    {
      value: 'sl',
      label: 'Social Links',
      content: <SocialLinks />,
    },
  ];

  return (
    <div className="space-y-4 py-4">
      <SectionTitle text="Social Login & Chat Scripts" />
      <div className="px-5 ">
        <p className="text-xs pb-3 text-gray-500">
          Manage all your Social Login Scripts and Third Party Chat API
        </p>
        <TabsLayout defaultValue="ga" items={tabItems} />
      </div>
    </div>
  );
}
