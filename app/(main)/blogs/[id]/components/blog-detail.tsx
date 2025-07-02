import { useBlogContext } from "@/components/providers/BlogProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blogPostType";
import DOMPurify from "dompurify";
import { GetBlogById, GetSavedPost, PostSavedPost } from "@/utils/apiUtils";
import {
  Bookmark,
  Calendar,
  Heart,
  MessageSquareText,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BlogIdProps = {
  id: string;
};

export default function BlogDetail({ id }: BlogIdProps) {
  const [blogPost, setBlogPost] = useState<BlogPost>();
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>();
  const { triggerRefetch, refetch } = useBlogContext();

  useEffect(() => {
    const getDetail = async () => {
      const response = await GetBlogById(id);
      console.log(response);
      if (response?.success == true) {
        setBlogPost(response.data);
      }
    };
    getDetail();
  }, [refetch]);

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
  }, [refetch]);

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

  const handleSavePost = async (id: string) => {
    const response = await PostSavedPost(id);
    if (response?.success === true) {
      toast(
        checkSavedPost(blogPost?._id || " ") === true
          ? "Post UnSaved"
          : "Post Saved"
      );
      triggerRefetch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getAuthorInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  }

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="mb-8">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              Blog Post
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              {blogPost?.title}
            </h1>
            <Badge>
              {blogPost?.category?.charAt(0).toUpperCase()}
              {blogPost?.category.slice(1)}
            </Badge>
          </div>

          {/* Author and Date Info */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="/placeholder.svg"
                alt={`${blogPost?.firstName} ${blogPost?.lastName}`}
              />
              <AvatarFallback>
                {getAuthorInitials(
                  blogPost?.firstName || "",
                  blogPost?.lastName || ""
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {(blogPost?.firstName || "", blogPost?.lastName || "")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={blogPost?.createdAt}>
                  {formatDate(blogPost?.createdAt || "")}
                </time>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={blogPost?.imageUrl || "/placeholder.svg"}
              alt={blogPost?.title || ""}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="flex justify-between items-center m-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSavePost(blogPost?._id || "")}
            className="flex justify-around items-center gap-1 "
          >
            {checkSavedPost(blogPost?._id || " ") === true ? (
              <Bookmark className={`h-4 w-4  fill-primary`} />
            ) : (
              <Bookmark className={`h-4 w-4  `} />
            )}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost">
              <Heart />
            </Button>
            <Button variant="ghost">
              <MessageSquareText />
            </Button>
          </div>
        </div>
        {/* Blog Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-wrap  break-words text-justify">
            {stripHtmlTags(blogPost?.text || "")}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="/placeholder.svg"
                  alt={`${
                    (blogPost?.firstName || "", blogPost?.lastName || "")
                  }`}
                />
                <AvatarFallback>
                  {getAuthorInitials(
                    blogPost?.firstName || "",
                    blogPost?.lastName || ""
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {blogPost?.firstName} {blogPost?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Published on {formatDate(blogPost?.createdAt || "")}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
