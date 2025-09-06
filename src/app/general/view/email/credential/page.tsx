import { DataTable } from "@/components/TableHelper/data-table"
import { email_credential_columns, EmailCredential } from "@/components/TableHelper/email_credential_columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

function getData(): EmailCredential[] {
  return [
    {
      id: 1,
      host_server: "smtp.gmail.com",
      port: 587,
      email: "infoguptodhan@gmail.com",
      password: "ozvpyolyljdeiewr",
      mail_from_name: "Guptodhan",
      mail_from_email: "infoguptodhan@gmail.com",
      encryption: "TLS",
      status: "active"
    }
  ];
}

export default function EmailCredentialPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">SMTP Email Configurations</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Email Server
        </Button>
      </div>
      <DataTable columns={email_credential_columns} data={data} />
    </div>
  );
}
