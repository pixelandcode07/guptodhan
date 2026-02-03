import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextPosition } from "../SliderForm";

interface TopRowProps {
  textPosition: TextPosition | '';
  setTextPosition: (val: TextPosition | '') => void;
  sliderLink: string;
  setSliderLink: (val: string) => void;
}

export default function TopRow({
  textPosition,
  setTextPosition,
  sliderLink,
  setSliderLink,
}: TopRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
      
      <div className="space-y-2">
        <Label>Text Position <span className="text-red-500">*</span></Label>
        {/* 🔥 FIX: value={textPosition} যোগ করা হয়েছে */}
        <Select 
          value={textPosition} 
          onValueChange={(val) => setTextPosition(val as TextPosition)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select text position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Slider Link (Optional)</Label>
        <Input 
          value={sliderLink} 
          onChange={(e) => setSliderLink(e.target.value)} 
          placeholder="https://..."
        />
      </div>
    </div>
  );
}