import SectionTitle from '@/components/ui/SectionTitle';
import ThemeColorCard from './Components/ThemeColorCard';
import { ThemeSettingsServices } from '@/lib/modules/theme-settings/theme.service';
import dbConnect from '@/lib/db';

// This is an async Server Component that runs on the server
export default async function ThemeSettingsPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  const themeData = await ThemeSettingsServices.getPublicThemeFromDB();

  return (
    <div className="bg-white pt-5 p-4 sm:p-6">
      <SectionTitle text="Update Website Theme Color" />
      <div className="mt-4">
        <p className="pb-2 text-sm text-gray-500">
          Customize your website's primary and secondary theme colors.
        </p>
        {/* Fetch করা ডেটা props হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে।
          JSON.parse(JSON.stringify(...)) ব্যবহার করা হয়েছে Mongoose ডকুমেন্টকে 
          সাধারণ অবজেক্টে রূপান্তর করার জন্য, যা Server Component থেকে Client Component-এ পাঠানো নিরাপদ।
        */}
        {/* ✅ FIX: The prop name has been changed from 'initialData' to 'initialColors' */}
        <ThemeColorCard initialColors={JSON.parse(JSON.stringify(themeData))} />
      </div>
    </div>
  );
}