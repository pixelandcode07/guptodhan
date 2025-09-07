import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm'; // client component

export default function Page() {
  const staticContent = `🎯 আমাদের মিশন:

শরীয়তপুরের মানুষকে নিরাপদ, সহজ ও স্মার্ট অনলাইন কেনাকাটার সুবিধা প্রদান করা, যেখানে স্থানীয় বিক্রেতা ও ক্রেতারা একই প্ল্যাটফর্মে যুক্ত হতে পারেন।

🚀 আমাদের ভিশন:

শরীয়তপুরের শীর্ষস্থানীয় অনলাইন মার্কেটপ্লেস হিসেবে গড়ে ওঠা, যেখানে সবার জন্য বিশ্বাসযোগ্য ও সুবিধাজনক কেনাকাটার সুযোগ থাকবে।`;

  return (
    <div className="bg-white pt-5 px-4">
      <SectionTitle text="General Information Form" />
      {/* All interactive buttons inside the client component */}
      <AboutUsForm initialContent={staticContent} />
    </div>
  );
}
