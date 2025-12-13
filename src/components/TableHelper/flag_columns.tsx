import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type Flag = {
  _id: string;
  id: number;
  productFlagId: string;
  name: string;
  icon: string;
  status: "Active" | "Inactive";
  featured: "Featured" | "Not Featured";
  created_at: string;
};

export type FlagColumnHandlers = {
  onEdit: (flag: Flag) => void;
  onDelete: (flag: Flag) => void;
  onToggleFeatured: (flag: Flag) => void;
};

export const getFlagColumns = ({ onEdit, onDelete, onToggleFeatured }: FlagColumnHandlers): ColumnDef<Flag>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Flag Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const flag = row.original as Flag;
      const icon = flag.icon;
      return (
        <div className="flex items-center">
          {icon && icon.trim() !== '' ? (
            <img
              src={icon}
              alt="Flag icon"
              className="w-8 h-8 rounded object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-xs text-gray-500">No icon</span>`;
                }
              }}
            />
          ) : (
            <span className="text-xs text-gray-500">No icon</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.getValue("featured") as string;
      const flag = row.original as Flag;
      return (
        <button
          onClick={() => onToggleFeatured(flag)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
            featured === "Featured"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          {featured}
        </button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const flag = row.original as Flag;
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(flag)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(flag)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];