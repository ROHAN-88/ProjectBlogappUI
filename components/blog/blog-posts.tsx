"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blogPostType";
import { GetAllPost, GetSavedPost } from "@/utils/apiUtils";
import { formatDistanceToNow } from "date-fns";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>();

  const { toast } = useToast();
  const checkSavedPost = (postId: string) => {
    if (savedPosts) {
      for (let i = 0; i < savedPosts.length; i++) {
        if (savedPosts[i]._id === postId) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const getAllPosts = async () => {
      const postDetail = await GetAllPost();
      if (postDetail?.success === true) {
        setPosts(postDetail.data);
      }
    };
    getAllPosts();
  }, []);

  useEffect(() => {
    const getSavedPost = async () => {
      const response = await GetSavedPost();
      if (response?.success === true) {
        setSavedPosts(response.data);
      } else {
        console.error("Could not Get Saved Posts");
      }
    };
    getSavedPost();
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
    <div className="space-y-6">
      <Carousel orientation="horizontal">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post._id} className="basis-1/4">
              <Link href={`/blogs/${post._id}`}>
                <Card
                  key={post._id}
                  className="overflow-hidden flex flex-col justify-center "
                >
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex justify-between items-center h-[40px]">
                      <h3 className="font-semibold text-lg ">{post?.title}</h3>

                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handleSavePost(post._id || "")}
                        className="flex justify-around items-center gap-1 "
                      >
                        {checkSavedPost(post?._id || " ") === true ? (
                          <Bookmark className={`h-4 w-4  fill-primary`} />
                        ) : (
                          <Bookmark className={`h-4 w-4  `} />
                        )}

                        {/* {savedPosts?.includes(post._id || "") ? "Saved" : "Save"} */}
                      </Button>
                    </div>
                    {post.imageUrl && (
                      <div className="relative h-[150px] w-full flex items-center rounded-md overflow-hidden">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={`Image for ${post.title}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className=" h-[110px]">
                      <p className="whitespace-pre-line">
                        {post.text.split(" ").slice(0, 27).join(" ")} ...
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={post.pictureUrl}
                          alt={post.firstName}
                        />
                        <AvatarFallback>
                          {post?.firstName.substring(0, 2).toUpperCase() || " "}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {post.firstName} •{" "}
                          {formatDistanceToNow(post.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
