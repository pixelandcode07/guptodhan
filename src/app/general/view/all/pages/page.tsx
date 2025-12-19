import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { all_page_columns } from "@/components/TableHelper/all_page_columns";
import { DataTable } from "@/components/TableHelper/data-table";
import SectionTitle from "@/components/ui/SectionTitle";
import { fetchSeoPages } from "@/lib/ContentManagement/fetchAllSeoPages";
import { getServerSession } from "next-auth";


export default async function Page() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  console.log("AccessToken", token)

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }


  const pages = await fetchSeoPages(token as string);
  // console.log('Seo pages', pages)
  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">

      <SectionTitle text="View All Custom Pages" />
      <div className="px-5">
        <DataTable columns={all_page_columns} data={pages} />
      </div>
    </div>
  );
}
