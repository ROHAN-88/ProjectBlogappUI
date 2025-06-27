"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { GetAllPost } from "@/utils/apiUtils";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Ellipsis, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
export type BlogPost = {
  _id: string;
  title: string;
  text: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
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
  //   if (!user) {
  //     toast({
  //       title: "Authentication required",
  //       description: "Please log in to save posts.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   const isSaved = savedPosts.includes(postId)
  //   let updatedSavedPosts: string[]

  //   if (isSaved) {
  //     // Unsave the post
  //     updatedSavedPosts = savedPosts.filter((id) => id !== postId)
  //     toast({
  //       title: "Post unsaved",
  //       description: "The post has been removed from your saved items.",
  //     })
  //   } else {
  //     // Save the post
  //     updatedSavedPosts = [...savedPosts, postId]
  //     toast({
  //       title: "Post saved",
  //       description: "The post has been added to your saved items.",
  //     })
  //   }

  //   // Update state and localStorage
  //   setSavedPosts(updatedSavedPosts)
  //   localStorage.setItem(`savedPosts-${user.id}`, JSON.stringify(updatedSavedPosts))
  // }

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
            <CarouselItem className="basis-1/3">
              <Card
                key={post._id}
                className="overflow-hidden flex flex-col justify-center "
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-2xl my-2">
                      {post?.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="" align="end">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>

                        <DropdownMenuItem>
                          {" "}
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleSavePost(post.id)}
                            className="flex justify-around items-center gap-1 w-full"
                          >
                            <Bookmark
                            // className={`h-4 w-4 ${
                            // user && savedPosts.includes(post.id) ? "fill-primary" : ""
                            // }`}
                            />
                            Save
                            {/* {user && savedPosts.includes(post.id) ? "Saved" : "Save"} */}
                          </Button>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {" "}
                          <Button
                            variant="destructive"
                            size="sm"
                            // onClick={() => handleDelete(post.id, post.userId)}
                            className="flex items-center gap-1 w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {post.imageUrl && (
                    <div className="relative h-[300px] w-full flex items-center rounded-md overflow-hidden">
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
                      {" "}
                      {post.text.split(" ").slice(0, 40).join(" ")} ...
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={post.pictureUrl} alt={post.firstName} />
                      <AvatarFallback>
                        {post.firstName.substring(0, 2).toUpperCase()}
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
