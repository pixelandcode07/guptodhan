import { TeamMemberServices } from '@/lib/modules/about-team/team.service';
import TeamsTable from './Components/TeamTable';
import dbConnect from '@/lib/db'; // ✅ Import your database connection

// This is now an async Server Component
export default async function TeamListPage() {
  // Directly connect to the DB and call the service function on the server
  await dbConnect();
  // Assuming you have a service function to get all team members
  const teamData = await TeamMemberServices.getPublicTeamFromDB();

  return (
    // Pass the fetched data as a prop to the client component.
    // JSON.parse(JSON.stringify(...)) converts the Mongoose document
    // to a plain object, which is safe to pass from Server to Client Components.
    <TeamsTable initialData={JSON.parse(JSON.stringify(teamData))} />
  );
}