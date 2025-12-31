import GeneralInfoForm from './Components/GeneralInfoForm';
import { SettingsServices } from '@/lib/modules/settings/settings.service'; // Import your service
import dbConnect from '@/lib/db'; // Import your database connection

// This is now an async Server Component
export default async function GeneralInfoPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  const settingsData = await SettingsServices.getPublicSettingsFromDB();

  return (
    <div className="min-h-screen pt-5 bg-gray-50">
      <div className="bg-white shadow rounded">
        {/* Pass the fetched data as a prop to the client component.
          JSON.parse(JSON.stringify(...)) is used to convert the Mongoose document
          to a plain object, which is safe to pass from Server to Client Components.
        */}

        <GeneralInfoForm data={JSON.parse(JSON.stringify(settingsData))} />
      </div>
    </div>
  );
}
