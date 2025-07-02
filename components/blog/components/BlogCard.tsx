"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BlogPost } from "@/types/blogPostType";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import DOMPurify from "dompurify";
type propsType = {
  data: BlogPost;
};

const BlogCard = ({ data }: propsType) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverShadow =
    "rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px";

  const post = data;
  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  }

  return (
    <Card
      key={post._id}
      className="overflow-hidden flex flex-col justify-center "
      style={{
        boxShadow: isHovered ? hoverShadow : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="space-y-4 pt-4">
        <div className="flex justify-between items-center h-[40px]">
          <h3 className="font-semibold text-lg ">{post?.title}</h3>

          <Badge>
            {post?.category?.charAt(0).toUpperCase()}
            {post?.category.slice(1)}
          </Badge>
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
          <p className="text-wrap  break-words text-justify">
            {stripHtmlTags(post.text).split(" ").slice(0, 20).join(" ") + "..."}
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
