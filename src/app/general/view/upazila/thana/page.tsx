import { DataTable } from "@/components/TableHelper/data-table"
import { upazila_thana_columns, UpazilaThana } from "@/components/TableHelper/upazila_thana_columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

function getData(): UpazilaThana[] {
  return [
    {
      id: 1,
      district: "Comilla",
      upazila_thana_english: "Debidwar",
      upazila_thana_bangla: "দেবিদ্বার",
      website: "debidwar.comilla.gov.bd"
    },
    {
      id: 2,
      district: "Comilla",
      upazila_thana_english: "Barura",
      upazila_thana_bangla: "বরুড়া",
      website: "barura.comilla.gov.bd"
    },
    {
      id: 3,
      district: "Comilla",
      upazila_thana_english: "Brahmanpara",
      upazila_thana_bangla: "ব্রাহ্মণপাড়া",
      website: "brahmanpara.comilla.gov.bd"
    },
    {
      id: 4,
      district: "Comilla",
      upazila_thana_english: "Chandina",
      upazila_thana_bangla: "চান্দিনা",
      website: "chandina.comilla.gov.bd"
    },
    {
      id: 5,
      district: "Comilla",
      upazila_thana_english: "Chauddagram",
      upazila_thana_bangla: "চৌদ্দগ্রাম",
      website: "chauddagram.comilla.gov.bd"
    },
    {
      id: 6,
      district: "Comilla",
      upazila_thana_english: "Daudkandi",
      upazila_thana_bangla: "দাউদকান্দি",
      website: "daudkandi.comilla.gov.bd"
    },
    {
      id: 7,
      district: "Comilla",
      upazila_thana_english: "Homna",
      upazila_thana_bangla: "হোমনা",
      website: "homna.comilla.gov.bd"
    },
    {
      id: 8,
      district: "Comilla",
      upazila_thana_english: "Laksam",
      upazila_thana_bangla: "লাকসাম",
      website: "laksam.comilla.gov.bd"
    },
    {
      id: 9,
      district: "Comilla",
      upazila_thana_english: "Muradnagar",
      upazila_thana_bangla: "মুরাদনগর",
      website: "muradnagar.comilla.gov.bd"
    },
    {
      id: 10,
      district: "Comilla",
      upazila_thana_english: "Nangalkot",
      upazila_thana_bangla: "নাঙ্গলকোট",
      website: "nangalkot.comilla.gov.bd"
    },
    {
      id: 11,
      district: "Comilla",
      upazila_thana_english: "Comilla Sadar",
      upazila_thana_bangla: "কুমিল্লা সদর",
      website: "comillasadar.comilla.gov.bd"
    },
    {
      id: 12,
      district: "Comilla",
      upazila_thana_english: "Meghna",
      upazila_thana_bangla: "মেঘনা",
      website: "meghna.comilla.gov.bd"
    },
    {
      id: 13,
      district: "Comilla",
      upazila_thana_english: "Monohargonj",
      upazila_thana_bangla: "মনোহরগঞ্জ",
      website: "monohargonj.comilla.gov.bd"
    },
    {
      id: 14,
      district: "Comilla",
      upazila_thana_english: "Sadarsouth",
      upazila_thana_bangla: "সদর দক্ষিণ",
      website: "sadarsouth.comilla.gov.bd"
    },
    {
      id: 15,
      district: "Comilla",
      upazila_thana_english: "Titas",
      upazila_thana_bangla: "তিতাস",
      website: "titas.comilla.gov.bd"
    }
  ];
}

export default function UpazilaThanaPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Upazila & Thana List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Upazila/Thana
        </Button>
      </div>
      
      <DataTable columns={upazila_thana_columns} data={data} />
    </div>
  );
}
