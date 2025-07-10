"use client";

import { BlogPost } from "@/types/blogPostType";
import { GetAllPost } from "@/utils/apiUtils";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import CategoryCarousel from "./components/CarosouselCards";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No posts yet. Create your first post above!
        </p>
      </div>
    );
  }

  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  }

  const workplacePost = posts
    .slice()
    .sort(
      (a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0)
    )[0];
  return (
    <>
      {workplacePost && (
        <Link href={`/blogs/${workplacePost._id}`}>
          <section className="mb-12">
            <div className="relative overflow-hidden rounded-lg bg-card group">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[21/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[21/9]">
                <Image
                  src={workplacePost.imageUrl || "/placeholder.svg"}
                  alt={workplacePost.title || ""}
                  fill
                  className="object-cover"
                  priority
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 group-hover:from-black/90" />

                {/* CONTENT OVER IMAGE */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <Badge className="mb-3 sm:mb-4 bg-primary text-xs sm:text-sm">
                    {workplacePost.category}
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 leading-tight">
                    {workplacePost.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-200 max-w-3xl line-clamp-3">
                    {stripHtmlTags(workplacePost.text)
                      .split(" ")
                      .slice(0, 20)
                      .join(" ") + "..."}
                  </p>

                  {/* AUTHOR INFO */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white">
                      <AvatarImage
                        src={workplacePost.pictureUrl || "/placeholder.svg"}
                        alt={
                          workplacePost.firstName + " " + workplacePost.lastName
                        }
                      />
                      <AvatarFallback>
                        {(workplacePost.firstName || "A").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {workplacePost.firstName + " " + workplacePost.lastName}
                      </p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(workplacePost.createdAt || "")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Link>
      )}

      <CategoryCarousel category="recent" label="Recent" posts={posts} />

      <CategoryCarousel category="animal" label="Animal" posts={posts} />

      <CategoryCarousel category="food" label="Food" posts={posts} />

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
