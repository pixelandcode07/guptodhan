

import BannerStructure from "./components/BannerStructure";

// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import ColorPicker from "@/components/ui/color-picker";
// import Image from "next/image";



export default function BannerBuilder() {


  return (
    <>
      <h1 className="text-lg font-semibold border-l-2 border-blue-500">
        <span className="pl-5">Set Info for Promotional Banner</span>
      </h1>

      <BannerStructure />
    </>
  );
}
