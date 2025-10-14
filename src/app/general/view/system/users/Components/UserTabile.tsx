'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { seystem_users_columns } from '@/components/TableHelper/system_users_columns';

export default function UserTabile({ data }: { data: any[] }) {
  console.log(data);
  return (
    <div>
      <DataTable columns={seystem_users_columns} data={data} />
    </div>
  );
}
