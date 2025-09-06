import TabsLayout from '@/components/ReusableComponents/TabsLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import CrispChatForm from './Components/CrispLiveChat';
import FacebookPixelForm from './Components/FacebookPixelForm';
import GoogleAnalyticsForm from './Components/GoogleAnalyticsForm';
import RecaptchaForm from './Components/GoogleRecaptcha';
import GoogleTagManagerForm from './Components/GoogleTagManagerForm';
import MessengerChatForm from './Components/MessegeChatPlugin';
import TawkChatForm from './Components/TawkLiveChat';

// Dynamic import for performance

export default function SocialLoginSettings() {
  const tabItems = [
    { value: 'ga', label: 'Google Analytic', content: <GoogleAnalyticsForm /> },
    {
      value: 'gtm',
      label: 'Google Tag Manager',
      content: <GoogleTagManagerForm />,
    },
    {
      value: 'fp',
      label: 'Facebook pixel',
      content: <FacebookPixelForm />,
    },
    {
      value: 'gr',
      label: 'Google Recaptcha',
      content: <RecaptchaForm />,
    },
    // {
    //   value: 'slf',
    //   label: 'Social Login',
    //   content: <SocialLoginForm />,
    // },
    {
      value: 'mcpf',
      label: 'Messenger Chat Plugin',
      content: <MessengerChatForm />,
    },
    {
      value: 'TawkChatForm',
      label: 'Tawk.to Live Chat',
      content: <TawkChatForm />,
    },
    {
      value: 'clcf',
      label: 'Crisp Live Chat',
      content: <CrispChatForm />,
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
