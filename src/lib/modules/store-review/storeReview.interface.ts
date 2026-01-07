export interface IStoreReview {
  storeId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
