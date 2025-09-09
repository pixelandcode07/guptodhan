import { Document, Types } from 'mongoose';

export interface IBrand extends Document {
  brandId: string;           
  name: string;               
  brandLogo: string;          
  brandBanner: string;        
  category: Types.ObjectId;   
  subCategory: Types.ObjectId; 
  children: Types.ObjectId[]; 
  status: 'active' | 'inactive'; 
}
