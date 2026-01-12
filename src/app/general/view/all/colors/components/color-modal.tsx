"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Color } from "@/components/TableHelper/color_columns";

interface ColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; code: string; status?: string }) => void;
  editing: Color | null;
  onClose: () => void;
}

// Color name to hex code mapping
const colorNameToHex: Record<string, string> = {
  // Basic colors
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  
  // Extended colors
  navy: "#000080",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00FF00",
  aqua: "#00FFFF",
  cyan: "#00FFFF",
  teal: "#008080",
  silver: "#C0C0C0",
  gold: "#FFD700",
  indigo: "#4B0082",
  violet: "#EE82EE",
  magenta: "#FF00FF",
  fuchsia: "#FF00FF",
  coral: "#FF7F50",
  salmon: "#FA8072",
  turquoise: "#40E0D0",
  skyblue: "#87CEEB",
  lavender: "#E6E6FA",
  beige: "#F5F5DC",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  tan: "#D2B48C",
  chocolate: "#D2691E",
  crimson: "#DC143C",
  darkred: "#8B0000",
  darkgreen: "#006400",
  darkblue: "#00008B",
  lightblue: "#ADD8E6",
  lightgreen: "#90EE90",
  lightgray: "#D3D3D3",
  lightgrey: "#D3D3D3",
  darkgray: "#A9A9A9",
  darkgrey: "#A9A9A9",
  mint: "#F5FFFA",
  peach: "#FFE5B4",
  plum: "#DDA0DD",
  tomato: "#FF6347",
  orangered: "#FF4500",
  forestgreen: "#228B22",
  seagreen: "#2E8B57",
  steelblue: "#4682B4",
  royalblue: "#4169E1",
  mediumblue: "#0000CD",
  darkviolet: "#9400D3",
  mediumpurple: "#9370DB",
  slateblue: "#6A5ACD",
  darkslateblue: "#483D8B",
  mediumslateblue: "#7B68EE",
  darkmagenta: "#8B008B",
  mediumvioletred: "#C71585",
  deeppink: "#FF1493",
  hotpink: "#FF69B4",
  lightpink: "#FFB6C1",
  palegreen: "#98FB98",
  lightseagreen: "#20B2AA",
  mediumturquoise: "#48D1CC",
  darkturquoise: "#00CED1",
  cadetblue: "#5F9EA0",
  lightcyan: "#E0FFFF",
  paleturquoise: "#AFEEEE",
  powderblue: "#B0E0E6",
  cornflowerblue: "#6495ED",
  dodgerblue: "#1E90FF",
  deepskyblue: "#00BFFF",
  lightskyblue: "#87CEFA",
  lightsteelblue: "#B0C4DE",
  aliceblue: "#F0F8FF",
  ghostwhite: "#F8F8FF",
  whitesmoke: "#F5F5F5",
  gainsboro: "#DCDCDC",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  slategray: "#708090",
  slategrey: "#708090",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  dimgray: "#696969",
  dimgrey: "#696969",
  snow: "#FFFAFA",
  honeydew: "#F0FFF0",
  mintcream: "#F5FFFA",
  azure: "#F0FFFF",
  antiquewhite: "#FAEBD7",
  papayawhip: "#FFEFD5",
  blanchedalmond: "#FFEBCD",
  bisque: "#FFE4C4",
  peachpuff: "#FFDAB9",
  navajowhite: "#FFDEAD",
  moccasin: "#FFE4B5",
  cornsilk: "#FFF8DC",
  lemonchiffon: "#FFFACD",
  lightyellow: "#FFFFE0",
  lightgoldenrodyellow: "#FAFAD2",
  palegoldenrod: "#EEE8AA",
  darkkhaki: "#BDB76B",
  peru: "#CD853F",
  burlywood: "#DEB887",
  rosybrown: "#BC8F8F",
  sandybrown: "#F4A460",
  goldenrod: "#DAA520",
  darkgoldenrod: "#B8860B",
  sienna: "#A0522D",
  saddlebrown: "#8B4513",
  firebrick: "#B22222",
  indianred: "#CD5C5C",
  lightcoral: "#F08080",
  darksalmon: "#E9967A",
  lightsalmon: "#FFA07A",
  mistyrose: "#FFE4E1",
  seashell: "#FFF5EE",
  oldlace: "#FDF5E6",
  linen: "#FAF0E6",
  floralwhite: "#FFFAF0",
  wheat: "#F5DEB3",
  darkorange: "#FF8C00",
  darkseagreen: "#8FBC8F",
  mediumseagreen: "#3CB371",
  greenyellow: "#ADFF2F",
  chartreuse: "#7FFF00",
  lawngreen: "#7CFC00",
  limegreen: "#32CD32",
  yellowgreen: "#9ACD32",
  olivedrab: "#6B8E23",
  darkolivegreen: "#556B2F",
  mediumaquamarine: "#66CDAA",
  darkcyan: "#008B8B",
  aquamarine: "#7FFFD4",
  springgreen: "#00FF7F",
  mediumspringgreen: "#00FA9A",
  midnightblue: "#191970",
  rebeccapurple: "#663399",
  blueviolet: "#8A2BE2",
  mediumorchid: "#BA55D3",
  darkorchid: "#9932CC",
  palevioletred: "#DB7093",
  wood: "#DEB887",
  lavenderblush: "#FFF0F5",
};

export default function ColorModal({ open, onOpenChange, onSubmit, editing, onClose }: ColorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const codeManuallyEdited = useRef(false);

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name,
        code: editing.code,
        status: editing.status,
      });
      codeManuallyEdited.current = true;
    } else {
      setFormData({
        name: "",
        code: "",
        status: "Active",
      });
      codeManuallyEdited.current = false;
    }
  }, [editing, open]);

  // Auto-fill color code based on color name
  useEffect(() => {
    if (!editing && formData.name && !codeManuallyEdited.current) {
      const normalizedName = formData.name.trim().toLowerCase();
      const colorCode = colorNameToHex[normalizedName];
      if (colorCode) {
        setFormData((prev) => ({ ...prev, code: colorCode }));
      }
    }
  }, [formData.name, editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      return;
    }
    
    // Validate color code format
    const colorCodeRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorCodeRegex.test(formData.code)) {
      setValidationError("Please enter a valid color code (e.g., #FF0000 or #F00)");
      return;
    }
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      status: "Active",
    });
    setValidationError(null);
    codeManuallyEdited.current = false;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {editing ? "Edit Color" : "Add New Color"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Color Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter color name"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="code" className="text-sm sm:text-base font-medium">
              Color Code
            </Label>
            <div className="flex items-center gap-2 sm:gap-3">
              <Input
                id="code"
                type="color"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  codeManuallyEdited.current = true;
                  if (validationError) setValidationError(null);
                }}
                className="w-12 h-10 sm:w-16 sm:h-12 p-1 border border-gray-300 rounded cursor-pointer flex-shrink-0"
              />
              <Input
                id="code-text"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  codeManuallyEdited.current = true;
                  if (validationError) setValidationError(null);
                }}
                placeholder="#000000"
                required
                className="flex-1 font-mono text-xs sm:text-sm h-10 sm:h-12"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click the color picker or enter a hex code (e.g., #FF0000)
            </p>
            {validationError && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-600">{validationError}</p>
              </div>
            )}
          </div>

          {editing && (
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="status" className="text-sm sm:text-base font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-sm sm:text-base">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-sm sm:text-base">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700"
            >
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
