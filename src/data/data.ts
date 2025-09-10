
export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const colourOptions: readonly ColourOption[] = [
  { value: 'Organic', label: 'Organic', color: '#00B8D9' },
  // , isFixed: true
  {
    value: 'Travel & Luggagesss',
    label: 'Travel & Luggagesss',
    color: '#00B8D9',
  },
  // , isDisabled: true
  { value: 'Toys & Games', label: 'Toys & Games', color: '#00B8D9' },
  {
    value: 'Sporting Goods & Outdoor',
    label: 'Sporting Goods & Outdoor',
    color: '#00B8D9',
  },
  // , isFixed: true
  { value: 'Pet Supplies', label: 'Pet Supplies', color: '#00B8D9' },
  { value: 'Office Supplies', label: 'Office Supplies', color: '#00B8D9' },
  { value: 'Kitchen & Dining', label: 'Kitchen & Dining', color: '#00B8D9' },
  { value: 'Home Appliances', label: 'Home Appliances', color: '#00B8D9' },
  { value: 'Furniture', label: 'Furniture', color: '#00B8D9' },
  { value: 'Food & Beverages', label: 'Food & Beverages', color: '#00B8D9' },
  { value: 'Books & Media', label: 'Books & Media', color: '#00B8D9' },
  {
    value: 'Beauty & Personal Care',
    label: 'Beauty & Personal Care',
    color: '#00B8D9',
  },
  {
    value: 'Apparel & Accessories',
    label: 'Apparel & Accessories',
    color: '#00B8D9',
  },
  { value: 'Baby & Toddlerss', label: 'Baby & Toddlerss', color: '#00B8D9' },
  { value: 'Automotive', label: 'Automotive', color: '#00B8D9' },
];

export interface VendorOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const vendorOptions: readonly VendorOption[] = [
  {
    value: 'Apex Global Traders',
    label: 'Apex Global Traders',
    color: '#00B8D9',
  },
  {
    value: 'Horizon Supply Co.',
    label: 'Horizon Supply Co.',
    color: '#00B8D9',
  },
  {
    value: 'Evergreen Enterprises',
    label: 'Evergreen Enterprises',
    color: '#00B8D9',
  },
  {
    value: 'Velocity Distributors',
    label: 'Velocity Distributors',
    color: '#00B8D9',
  },
  {
    value: 'Sunrise Wholesale Ltd.',
    label: 'Sunrise Wholesale Ltd.',
    color: '#00B8D9',
  },
  {
    value: 'Summit Imports & Exports',
    label: 'Summit Imports & Exports',
    color: '#00B8D9',
  },
  {
    value: 'Silverline Suppliers',
    label: 'Silverline Suppliers',
    color: '#00B8D9',
  },
  {
    value: 'MetroMart Partners',
    label: 'MetroMart Partners',
    color: '#00B8D9',
  },
  {
    value: 'BlueOcean Ventures',
    label: 'BlueOcean Ventures',
    color: '#00B8D9',
  },
  { value: 'PrimeGate Traders', label: 'PrimeGate Traders', color: '#00B8D9' },
];


export interface modeOptions {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}
export const modeOptions: readonly modeOptions[] = [
  { value: 'Production/Live', label: 'Production/Live', color: '#00B8D9' },
  { value: 'Test/Sandbox', label: 'Test/Sandbox', color: '#00B8D9' },
];

export interface statusOptions {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}

export const statusOptions: readonly statusOptions[] = [
  { value: 'Active', label: 'Active', color: '#00B8D9' },
  { value: 'Inactive', label: 'Inactive', color: '#00B8D9' },
];

export interface paymentOptions {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}




export const paymentOptions: readonly VendorOption[] = [
  { value: 'Bank Transfer', label: 'Bank Transfer', color: '#00B8D9' },
  { value: 'bkash', label: 'bkash', color: '#00B8D9' },
  { value: 'Nagad', label: 'Nagad', color: '#00B8D9' },
  { value: 'Rocket', label: 'Rocket', color: '#00B8D9' },
  { value: 'Upay', label: 'Upay', color: '#00B8D9' },
  { value: 'Sure Cash', label: 'Sure Cash', color: '#00B8D9' },
];


export interface FlavourOption {
  readonly value: string;
  readonly label: string;
  readonly rating: string;
}

export const flavourOptions: readonly FlavourOption[] = [
  { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
  { value: 'chocolate', label: 'Chocolate', rating: 'good' },
  { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
  { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' },
];


export interface DemoProductOpt {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}

export const demoProductOpt: readonly DemoProductOpt[] = [
  { value: 'Fashion', label: 'Fashion', color: '#00B8D9' },
  { value: 'Tech', label: 'Tech', color: '#00B8D9' },
  { value: 'Grocery', label: 'Grocery', color: '#00B8D9' }
];







// let bigOptions = [];
// for (let i = 0; i < 10000; i++) {
// 	bigOptions = bigOptions.concat(colourOptions);
// }

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly ColourOption[] | readonly FlavourOption[];
}

export const groupedOptions: readonly GroupedOption[] = [
  {
    label: 'Colours',
    options: colourOptions,
  },
  {
    label: 'Flavours',
    options: flavourOptions,
  },
];
