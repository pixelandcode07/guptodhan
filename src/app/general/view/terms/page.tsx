import TeamsTable from './Components/TeamTable';

export default async function Page() {
  let data = [];
  let error = null;

  try {
    const res = await fetch('http://localhost:3000/api/v1/public/about/team', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    data = json?.data || [];
  } catch (err: any) {
    error = err.message || 'Something went wrong while fetching team members';
  }

  return <TeamsTable data={data} error={error} />;
}
