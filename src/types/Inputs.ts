export type Inputs = {
  store_name: string;
  selectVendor: { label: string; value: string } | null;
  store_address: string;
  store_phone: string;
  store_email: string;
  short_description: string;
  description: string;
  commission: number;

  logo: File | null;
  banner: File | null;

  facebook_url: string;
  whatsapp_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  tiktok_url: string;

  store_meta_title: string;
  store_meta_keywords: string;
  store_meta_description: string;
};