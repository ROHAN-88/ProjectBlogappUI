import { categoryType } from "@/app/(main)/blogs/model";

export type likeType = {
  message: string;
  likesCount: number;
  likedUsers: string[];
};

export type BlogPost = {
  _id?: string;
  title?: string;
  text: string;
  imageUrl?: string;
  firstName: string;
  lastName?: string;
  likes?: likeType;
  category: categoryType;
  comment?: string[];
  pictureUrl?: string;
  createdAt: string;
  updatedAt?: string;
};
