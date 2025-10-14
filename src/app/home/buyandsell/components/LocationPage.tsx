// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { division_wise_locations, DivisionWiseLocations } from "@/data/division_wise_locations";

// export default function LocationPage() {
//   const params = useSearchParams();
//   const router = useRouter();

//   const category = params?.get("category");
//   const subcategory = params?.get("subcategory");

//   const [selectedDivision, setSelectedDivision] = useState<keyof DivisionWiseLocations | null>(null);
//   const [selectedCity, setSelectedCity] = useState<string | null>(null);

//   return (
//     <div className="md:max-w-[95vw] lg:max-w-[80vw] mx-auto grid grid-cols-1 md:grid-cols-3">
//       {/* Left sidebar - Divisions */}
//       <div className=" border-r p-4">
//         <h2 className="text-lg font-semibold mb-4">Divisions</h2>
//         {Object.keys(division_wise_locations).map((division) => (
//           <button
//             key={division}
//             onClick={() => {
//               setSelectedDivision(division as keyof DivisionWiseLocations);
//               setSelectedCity(null);
//             }}
//             className={`block w-full text-left p-2 rounded mb-2 ${selectedDivision === division ? "bg-blue-600 text-white" : "hover:bg-gray-100"
//               }`}
//           >
//             {division}
//           </button>
//         ))}
//       </div>

//       {/* Middle - Cities */}
//       <div className=" border-r p-4">
//         {selectedDivision ? (
//           <>
//             <h2 className="text-lg font-semibold mb-4">{selectedDivision} Cities</h2>
//             {Object.keys(division_wise_locations[selectedDivision]).map((city) => (
//               <button
//                 key={city}
//                 onClick={() => setSelectedCity(city)}
//                 className={`block w-full text-left p-2 rounded mb-2 ${selectedCity === city ? "bg-green-600 text-white" : "hover:bg-gray-100"
//                   }`}
//               >
//                 {city}
//               </button>
//             ))}
//           </>
//         ) : (
//           <p className="text-gray-500">Select a division to see cities</p>
//         )}
//       </div>

//       {/* Right - Areas */}
//       <div className="flex-1 p-4">
//         {selectedDivision && selectedCity ? (
//           <>
//             <h2 className="text-lg font-semibold mb-4">{selectedCity} Areas</h2>
//             <div className="grid grid-cols-2 gap-3">
//               {division_wise_locations[selectedDivision][selectedCity].map((area) => (
//                 <button
//                   key={area}
//                   onClick={() =>
//                     router.push(
//                       `/home/buyandsell/product-form?category=${category}&subcategory=${subcategory}&division=${selectedDivision}&city=${selectedCity}&area=${area}`
//                     )
//                   }
//                   className="p-3 border rounded hover:bg-gray-100"
//                 >
//                   {area}
//                 </button>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500">Select a city to see areas</p>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { division_wise_locations } from '@/data/division_wise_locations';
import { useSearchParams, useRouter } from "next/navigation";

type FormValues = {
  division: { label: string; value: string } | null;
  city: { label: string; value: string } | null;
  area: { label: string; value: string } | null;
  details: string;
};

export default function LocationPage() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params?.get("category");
  const subcategory = params?.get("subcategory");
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      division: null,
      city: null,
      area: null,
      details: '',
    },
  });

  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const selectedDivision = watch('division');
  const selectedCity = watch('city');

  // Division options
  const divisionOptions = Object.keys(division_wise_locations).map((div) => ({
    label: div,
    value: div,
  }));

  // City options (depends on selected division)
  const cityOptions = selectedDivision
    ? Object.keys(division_wise_locations[selectedDivision.value]).map((city) => ({
      label: city,
      value: city,
    }))
    : [];

  // Area options (depends on selected city)
  const areaOptions =
    selectedDivision && selectedCity
      ? division_wise_locations[selectedDivision.value][selectedCity.value].map((area) => ({
        label: area,
        value: area,
      }))
      : [];

  const onSubmit = (data: FormValues) => {
    setSubmittedData(data);
    console.log('Form submitted:', data);
    const location = data;
    router.push(
      `/home/buyandsell/product-form?category=${category}&subcategory=${subcategory}&location=${location}`
    )
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold text-center mb-8">Search Your Area</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Division */}
        <div>
          <Label className="mb-2 block">Select Division</Label>
          <Controller
            name="division"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={divisionOptions}
                placeholder="Choose Division"
                onChange={(val) => {
                  field.onChange(val);
                  // Reset city & area when division changes
                  reset((prev) => ({ ...prev, city: null, area: null }));
                }}
              />
            )}
          />
        </div>

        {/* City */}
        <div>
          <Label className="mb-2 block">Select City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={cityOptions}
                placeholder={
                  selectedDivision ? 'Choose City' : 'Select a division first'
                }
                isDisabled={!selectedDivision}
                onChange={(val) => {
                  field.onChange(val);
                  reset((prev) => ({ ...prev, area: null }));
                }}
              />
            )}
          />
        </div>

        {/* Area */}
        <div>
          <Label className="mb-2 block">Select Area</Label>
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={areaOptions}
                placeholder={selectedCity ? 'Choose Area' : 'Select a city first'}
                isDisabled={!selectedCity}
              />
            )}
          />
        </div>

        {/* Details Address */}
        <div>
          <Label className="mb-2 block">Detailed Address</Label>
          <Controller
            name="details"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Write your full address here..."
                rows={3}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <Button variant={'BlueBtn'} type="submit" className="w-full">
          Proceed
        </Button>
      </form>

      {/* {submittedData && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-2">Submitted Data:</h2>
          <p><strong>Division:</strong> {submittedData.division?.label}</p>
          <p><strong>City:</strong> {submittedData.city?.label}</p>
          <p><strong>Area:</strong> {submittedData.area?.label}</p>
          <p><strong>Details:</strong> {submittedData.details}</p>
        </div>
      )} */}
    </div>
  );
}

