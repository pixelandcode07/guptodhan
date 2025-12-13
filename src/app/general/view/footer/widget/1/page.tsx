import { FooterWidgetServices } from '@/lib/modules/footer-widget/footerWidget.service';
import { SocialLinksServices } from '@/lib/modules/social-links/social-links.service';
import dbConnect from '@/lib/db';
import SectionTitle from '@/components/ui/SectionTitle';
import TabsLayout from '@/components/ReusableComponents/TabsLayout';
import FooterWidget1 from '../Components/Wideget_1';
import SocialLinks from '../Components/Social_links';

// This is now an async Server Component
export default async function FooterWidgetPage() {
  // Fetch all data directly on the server
  await dbConnect();
  const widgetsData = await FooterWidgetServices.getAllWidgetsForAdminFromDB();
  const socialLinksData = await SocialLinksServices.getPublicSocialLinksFromDB();

  // Convert Mongoose documents to plain objects
  const widgets = JSON.parse(JSON.stringify(widgetsData));
  const socialLinks = JSON.parse(JSON.stringify(socialLinksData));

  // Find the specific widget for "Footer Widget 1" if it exists
  const widget1 = widgets.find((w: any) => w.widgetTitle === "Footer Widget 1");

  const tabItems = [
    { value: 'widget1', label: 'Footer Widget 1', content: <FooterWidget1 widget={widget1} /> },
    // Add other widget tabs here in the same way
    // { value: 'widget2', label: 'Footer Widget 2', content: <FooterWidget2 widget={widget2} /> },
    { value: 'social', label: 'Social Links', content: <SocialLinks initialLinks={socialLinks} /> },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 min-h-screen">
      <SectionTitle text="Footer Configuration" />
      <div className="mt-4">
        <TabsLayout defaultValue="widget1" items={tabItems} />
      </div>
    </div>
  );
}