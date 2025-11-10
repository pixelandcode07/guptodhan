import { Document } from 'mongoose';

export interface IProductSize extends Document {
  sizeId: string;             
  name: string;               
  status: 'active' | 'inactive'; 
  createdAt: Date;   
  orderCount: number;        
}
