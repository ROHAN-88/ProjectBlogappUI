"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BlogPost } from "@/types/blogPostType";
import { formatDistanceToNow } from "date-fns";
import { Bookmark } from "lucide-react";
import Image from "next/image";

type propsType = {
  data: BlogPost;
  savedPost: BlogPost[] | undefined;
};

const BlogCard = ({ data, savedPost }: propsType) => {
  const post = data;
  const savedPosts = savedPost;
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
  return (
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
            {post.text.split(" ").slice(0, 20).join(" ")} ...
          </p>
        </div>
      </CardContent>
      <CardFooter className="py-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.pictureUrl} alt={post.firstName} />
            <AvatarFallback>
              {post?.firstName.substring(0, 2).toUpperCase() || " "}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {post.firstName} {post.lastName}{" "}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(post.createdAt, {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
