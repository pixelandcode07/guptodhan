// Basic structure types
export type Area = string;
export type City = Record<string, Area[]>;
export type Division = Record<string, City>;

// Combined type for all divisions
export type DivisionWiseLocations = Division;

// Option type for react-select
export interface SelectOption {
  label: string;
  value: string;
}

export type LocationDataProps = {
  control: any;
  register: any;
  watch: any;
  divisionOptions: SelectOption[];
  cityOptions: SelectOption[];
  areaOptions: SelectOption[];
  selectedDivision: SelectOption | null;
  selectedCity: SelectOption | null;
  onBack: () => void;
  onNext: () => void;
};
