import { Document } from 'mongoose';

export interface IStore extends Document {
  storeId: string;                  
  storeLogo: string;              
  storeBanner: string;            
  storeName: string;              
  storeAddress: string;          
  storePhone: string;               
  storeEmail: string;              
  vendorShortDescription: string;  
  fullDescription: string;          
  storeSocialLink: string;          
  storeMetaTitle: string;           
  storeMetaKeywords: string[];      
  status: 'active' | 'inactive';    
  createdAt: Date;                  
}
