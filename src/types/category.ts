export interface Category {
  _id: string;
  name: string;
  icon?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  category: string;
  icon: string | File | null;
}
