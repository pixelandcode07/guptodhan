"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { division_wise_locations, DivisionWiseLocations } from "@/data/division_wise_locations";

export default function LocationPage() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params?.get("category");
  const subcategory = params?.get("subcategory");

  const [selectedDivision, setSelectedDivision] = useState<keyof DivisionWiseLocations | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="md:max-w-[95vw] lg:max-w-[80vw] mx-auto grid grid-cols-1 md:grid-cols-3">
      {/* Left sidebar - Divisions */}
      <div className=" border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Divisions</h2>
        {Object.keys(division_wise_locations).map((division) => (
          <button
            key={division}
            onClick={() => {
              setSelectedDivision(division as keyof DivisionWiseLocations);
              setSelectedCity(null);
            }}
            className={`block w-full text-left p-2 rounded mb-2 ${selectedDivision === division ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
          >
            {division}
          </button>
        ))}
      </div>

      {/* Middle - Cities */}
      <div className=" border-r p-4">
        {selectedDivision ? (
          <>
            <h2 className="text-lg font-semibold mb-4">{selectedDivision} Cities</h2>
            {Object.keys(division_wise_locations[selectedDivision]).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`block w-full text-left p-2 rounded mb-2 ${selectedCity === city ? "bg-green-600 text-white" : "hover:bg-gray-100"
                  }`}
              >
                {city}
              </button>
            ))}
          </>
        ) : (
          <p className="text-gray-500">Select a division to see cities</p>
        )}
      </div>

      {/* Right - Areas */}
      <div className="flex-1 p-4">
        {selectedDivision && selectedCity ? (
          <>
            <h2 className="text-lg font-semibold mb-4">{selectedCity} Areas</h2>
            <div className="grid grid-cols-2 gap-3">
              {division_wise_locations[selectedDivision][selectedCity].map((area) => (
                <button
                  key={area}
                  onClick={() =>
                    router.push(
                      `/home/buyandsell/product-form?category=${category}&subcategory=${subcategory}&division=${selectedDivision}&city=${selectedCity}&area=${area}`
                    )
                  }
                  className="p-3 border rounded hover:bg-gray-100"
                >
                  {area}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a city to see areas</p>
        )}
      </div>
    </div>
  );
}


