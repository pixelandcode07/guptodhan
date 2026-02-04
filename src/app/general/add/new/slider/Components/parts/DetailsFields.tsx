import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DetailsFieldsProps {
  subTitle: string;
  setSubTitle: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export default function DetailsFields({
  subTitle,
  setSubTitle,
  title,
  setTitle,
  description,
  setDescription,
}: DetailsFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-gray-700">Content Details</h3>
      
      <div className="space-y-2">
        <Label>Sub Title <span className="text-red-500">*</span></Label>
        <Input 
          value={subTitle} 
          onChange={(e) => setSubTitle(e.target.value)} 
          placeholder="e.g. New Arrival"
        />
      </div>

      <div className="space-y-2">
        <Label>Banner Title <span className="text-red-500">*</span></Label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g. Winter Collection"
        />
      </div>

      <div className="space-y-2">
        <Label>Banner Description <span className="text-red-500">*</span></Label>
        {/* 🔥 FIX: value={description} যোগ করা হয়েছে */}
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter banner description..."
          rows={4}
        />
      </div>
    </div>
  );
}