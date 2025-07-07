import { categoryType } from "@/app/(main)/blogs/model";

export type likeType = {
  message: string;
  likesCount: number;
  likedUsers: string[];
};
export type commentType = {
  userID: string;
  text: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};
export type BlogPost = {
  _id?: string;
  title?: string;
  text: string;
  userId?: string;
  imageUrl?: string;
  firstName: string;
  lastName?: string;
  likes?: likeType;
  category: categoryType;
  comment?: commentType[];
  pictureUrl?: string;
  createdAt: string;
  updatedAt?: string;
};
