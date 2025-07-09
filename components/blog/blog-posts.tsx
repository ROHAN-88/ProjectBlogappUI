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
            <div className="relative overflow-hidden rounded-lg bg-card">
              <div className="aspect-[21/9] relative">
                <Image
                  src={workplacePost.imageUrl || "/placeholder.svg"}
                  alt={workplacePost.title || ""}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <Badge className="mb-4 bg-primary">
                    {workplacePost.category}
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4 leading-tight">
                    {workplacePost.title}
                  </h2>
                  <p className="text-lg mb-6 text-gray-200 max-w-3xl">
                    {stripHtmlTags(workplacePost.text)
                      .split(" ")
                      .slice(0, 20)
                      .join(" ") + "..."}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage
                        src={workplacePost.pictureUrl || "/placeholder.svg"}
                        alt={
                          workplacePost.firstName + " " + workplacePost.lastName
                        }
                      />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {workplacePost.firstName + " " + workplacePost.lastName}
                      </p>
                      <div className="flex items-center text-sm text-gray-300">
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
