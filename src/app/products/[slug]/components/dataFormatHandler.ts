/**
 * ✅ TEMPORARY FIX: Handle both old (object) and new (string) backend formats
 * This utility extracts display value from color/size/storage data
 * Works with both formats until backend is fully updated
 */

/**
 * Extract display string from color data
 * Old format: { _id: "...", colorName: "Red", colorCode: "#FF0000" }
 * New format: "Red"
 */
export const extractColorDisplay = (color: any): string => {
  if (!color) return '';
  if (typeof color === 'string') return color;
  if (typeof color === 'object' && color.colorName) return color.colorName;
  return '';
};

/**
 * Extract display string from size data
 * Old format: { _id: "...", name: "M" }
 * New format: "M"
 */
export const extractSizeDisplay = (size: any): string => {
  if (!size) return '';
  if (typeof size === 'string') return size;
  if (typeof size === 'object' && size.name) return size.name;
  return '';
};

/**
 * Extract display string from storage data
 * Old format: { _id: "...", ram: 8, rom: 256 }
 * New format: "8GB / 256GB"
 */
export const extractStorageDisplay = (storage: any): string => {
  if (!storage) return '';
  if (typeof storage === 'string') return storage;
  if (typeof storage === 'object' && storage.ram && storage.rom) {
    return `${storage.ram}GB / ${storage.rom}GB`;
  }
  return '';
};

/**
 * Extract display string from sim type data
 * Old format: { _id: "...", name: "Dual SIM" }
 * New format: "Dual SIM"
 */
export const extractSimTypeDisplay = (simType: any): string => {
  if (!simType) return '';
  if (typeof simType === 'string') return simType;
  if (typeof simType === 'object' && simType.name) return simType.name;
  return '';
};

/**
 * Extract display string from condition data
 * Old format: { _id: "...", deviceCondition: "New" }
 * New format: "New"
 */
export const extractConditionDisplay = (condition: any): string => {
  if (!condition) return '';
  if (typeof condition === 'string') return condition;
  if (typeof condition === 'object' && condition.deviceCondition) return condition.deviceCondition;
  return '';
};

/**
 * Extract display string from warranty data
 * Old format: { _id: "...", warrantyName: "1 Year" }
 * New format: "1 Year"
 */
export const extractWarrantyDisplay = (warranty: any): string => {
  if (!warranty) return '';
  if (typeof warranty === 'string') return warranty;
  if (typeof warranty === 'object' && warranty.warrantyName) return warranty.warrantyName;
  return '';
};

/**
 * Process productOptions array and extract string values from all fields
 * Handles both old object format and new string format
 */
export const processProductOptions = (options: any[] = []) => {
  return options.map((option) => ({
    ...option,
    // Convert arrays of colors to array of display strings
    color: Array.isArray(option.color)
      ? option.color.map((c: any) => extractColorDisplay(c))
      : [extractColorDisplay(option.color)].filter(Boolean),
    
    // Convert arrays of sizes to array of display strings
    size: Array.isArray(option.size)
      ? option.size.map((s: any) => extractSizeDisplay(s))
      : [extractSizeDisplay(option.size)].filter(Boolean),
    
    // Convert storage to display string
    storage: extractStorageDisplay(option.storage),
    
    // Convert arrays of sim types to array of display strings
    simType: Array.isArray(option.simType)
      ? option.simType.map((sim: any) => extractSimTypeDisplay(sim))
      : [extractSimTypeDisplay(option.simType)].filter(Boolean),
    
    // Convert arrays of conditions to array of display strings
    condition: Array.isArray(option.condition)
      ? option.condition.map((cond: any) => extractConditionDisplay(cond))
      : [extractConditionDisplay(option.condition)].filter(Boolean),
    
    // Convert warranty to display string
    warranty: extractWarrantyDisplay(option.warranty),
  }));
};

/**
 * Process entire product object
 */
export const processProduct = (product: any) => {
  if (!product) return product;
  
  return {
    ...product,
    productOptions: processProductOptions(product.productOptions),
  };
};