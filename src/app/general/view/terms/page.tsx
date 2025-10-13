import axios from 'axios';
import TeamsTable from './Components/TeamTable';

const fetchTeams = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const { data } = await axios.get(`${baseUrl}/api/v1/public/about/team`);
    return data;
  } catch (error) {
    console.log('fetch facts Error:', error);
    return { data: [] };
  }
};

export default async function Page() {
  const data = await fetchTeams();
  return <TeamsTable data={data.data} />;
}
