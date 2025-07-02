"use client";

import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blogPostType";
import { GetAllPost, GetSavedPost } from "@/utils/apiUtils";
import { Hexagon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import BlogCard from "./components/BlogCard";
import CategoryCarousel from "./components/CarosouselCards";

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const getAllPosts = async () => {
      const postDetail = await GetAllPost();
      if (postDetail?.success === true) {
        setPosts(postDetail.data);
      }
    };
    getAllPosts();
  }, []);

  // const handleDelete = (id: string, userId: string) => {
  //   // Check if the current user is the author of the post
  //   if (user?.id !== userId) {
  //     toast({
  //       title: "Permission denied",
  //       description: "You can only delete your own posts.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setPosts((prevPosts) => {
  //     const updatedPosts = prevPosts.filter((post) => post.id !== id)
  //     // Save updated posts to localStorage
  //     localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
  //     return updatedPosts
  //   })

  //   toast({
  //     title: "Post deleted",
  //     description: "The blog post has been successfully deleted.",
  //   })
  // }

  // const handleSavePost = (postId: string) => {

  // };

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No posts yet. Create your first post above!
        </p>
      </div>
    );
  }

  return (
    <>
      <CategoryCarousel category="recent" label="Recent" posts={posts} />

      <CategoryCarousel category="food" label="Food" posts={posts} />

      <CategoryCarousel category="business" label="Business" posts={posts} />

      <CategoryCarousel category="business" label="Business" posts={posts} />

      <CategoryCarousel
        category="entertainment"
        label="Entertainment"
        posts={posts}
      />

      <CategoryCarousel category="fashion" label="Fashion" posts={posts} />

      <CategoryCarousel category="fitness" label="Fitness" posts={posts} />

      <CategoryCarousel category="health" label="Health" posts={posts} />

      <CategoryCarousel category="sports" label="Sports" posts={posts} />

      <CategoryCarousel category="travel" label="Travel" posts={posts} />

      <CategoryCarousel category="other" label="Others" posts={posts} />
    </>
  );
}
