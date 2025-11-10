import { Document, Types } from 'mongoose';

export interface IBrand extends Document {
  brandId: string;           
  name: string;               
  brandLogo: string;          
  brandBanner: string;        
  category: string;   
  subCategory: string; 
  childCategory: string; 
  status: 'active' | 'inactive'; 
  featured: 'featured' | 'not_featured';
  orderCount: number;
}
