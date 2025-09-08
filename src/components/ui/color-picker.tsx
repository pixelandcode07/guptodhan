"use client";

import { Controller } from "react-hook-form";
import { ChromePicker } from "react-color";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



import type { Control, FieldValues, Path } from "react-hook-form";

interface ColorPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export default function ColorPicker<T extends FieldValues>({ control, name }: ColorPickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-[120px] justify-start mt-2"
              style={{ backgroundColor: value }}
            >
              {/* {value} */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <ChromePicker
              color={value}
              onChange={(color) => onChange(color.hex)}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}