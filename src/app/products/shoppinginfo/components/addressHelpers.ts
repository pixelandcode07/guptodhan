/**
 * Structured address stored as JSON in the user's `address` field.
 * Saved via: JSON.stringify(AddressJSON)
 * Loaded via: JSON.parse(user.address)
 */
export interface AddressJSON {
  street: string;
  district: string;
  upazila: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Parse user.address string → structured AddressJSON.
 * Handles both new JSON format and old plain-string format gracefully.
 */
export function parseAddress(raw: string | undefined | null): AddressJSON {
  const empty: AddressJSON = {
    street: '',
    district: '',
    upazila: '',
    city: 'Dhaka',
    postalCode: '1000',
    country: 'Bangladesh',
  };

  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw);
    return {
      street:     parsed.street     || parsed.address || '',
      district:   parsed.district   || '',
      upazila:    parsed.upazila    || '',
      city:       parsed.city       || 'Dhaka',
      postalCode: parsed.postalCode || '1000',
      country:    parsed.country    || 'Bangladesh',
    };
  } catch {
    // Old plain-string format — treat as street address only
    return { ...empty, street: raw };
  }
}

/**
 * Serialize form fields → JSON string for storage.
 */
export function serializeAddress(fields: AddressJSON): string {
  return JSON.stringify(fields);
}

/**
 * Build a human-readable one-liner for display.
 */
export function formatAddressLine(addr: AddressJSON): string {
  return [addr.street, addr.upazila, addr.district, addr.city, addr.postalCode]
    .filter(Boolean)
    .join(', ');
}