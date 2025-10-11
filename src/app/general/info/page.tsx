import GeneralInfoForm from './Components/GeneralInfoForm';

export default async function GeneralInfoPage() {
  const res = await fetch('http://localhost:3000/api/v1/public/settings', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch settings');
  }

  const json = await res.json();
  const settings = json.data;

  return (
    <div className="min-h-screen pt-5 bg-gray-50">
      <div className="bg-white shadow rounded">
        <GeneralInfoForm data={settings || {}} />
      </div>
    </div>
  );
}
