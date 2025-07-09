"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BlogPost } from "@/types/blogPostType";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { Calendar } from "lucide-react";
import Image from "next/image";
type propsType = {
  data: BlogPost;
};

const BlogCard = ({ data }: propsType) => {
  const post = data;
  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    // <Card
    //   key={post._id}
    //   className="overflow-hidden flex flex-col justify-center transition-shadow duration-300 rounded-xl hover:shadow-[rgba(50,50,93,0.25)_0px_30px_60px_-12px,_rgba(0,0,0,0.3)_0px_18px_36px_-18px] "
    // >
    //   <CardContent className="space-y-4 pt-4">
    //     <div className="flex justify-between items-center h-[50px]">
    //       <h3 className="font-semibold text-base ">{post?.title}</h3>

    //       <Badge>
    //         {post?.category?.charAt(0).toUpperCase()}
    //         {post?.category.slice(1)}
    //       </Badge>
    //     </div>
    //     {post.imageUrl && (
    //       <div className="relative h-[150px] w-full flex items-center rounded-md overflow-hidden">
    //         <Image
    //           src={post.imageUrl || "/placeholder.svg"}
    //           alt={`Image for ${post.title}`}
    //           fill
    //           className="object-cover"
    //         />
    //       </div>
    //     )}
    //     <div className=" h-[110px]">
    //       <p className="text-wrap  break-words text-justify">
    //         {stripHtmlTags(post.text).split(" ").slice(0, 20).join(" ") + "..."}
    //       </p>
    //     </div>
    //   </CardContent>
    //   <CardFooter className="py-4">
    //     <div className="flex items-center gap-4">
    //       <Avatar>
    //         <AvatarImage src={post.pictureUrl} alt={post.firstName} />
    //         <AvatarFallback>
    //           {post?.firstName.substring(0, 2).toUpperCase() || " "}
    //         </AvatarFallback>
    //       </Avatar>
    //       <div>
    //         <h3 className="font-semibold">
    //           {post.firstName} {post.lastName}{" "}
    //         </h3>
    //         <p className="text-sm text-muted-foreground">
    //           {formatDistanceToNow(post.createdAt, {
    //             addSuffix: true,
    //           })}
    //         </p>
    //       </div>
    //     </div>
    //   </CardFooter>
    // </Card>
    <Card
      key={post._id}
      className="h-[500px] flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-[200px] relative">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.title || " "}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 flex flex-col justify-between flex-1">
        <div>
          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>
          <h4 className="text-xl font-semibold mb-3 line-clamp-2">
            {post.title}
          </h4>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {stripHtmlTags(post.text).split(" ").slice(0, 20).join(" ") + "..."}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={post.pictureUrl || "/placeholder.svg"}
                alt={post.firstName + " " + post.lastName}
              />
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {post.firstName + " " + post.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(post.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
