"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/types/blogPostType";
import DOMPurify from "dompurify";
import { useSearch } from "@/context/search-context";

interface SearchResultsProps {
  posts: BlogPost[];
}

export function SearchResults({ posts }: SearchResultsProps) {
  const { searchQuery, selectedCategory } = useSearch();

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

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "recent") {
        // For recent, sort by date and take the most recent ones
        filtered = filtered
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      } else {
        filtered = filtered.filter(
          (post) =>
            post.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post?.title.toLowerCase().includes(query) ||
          stripHtmlTags(post.text).toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          `${post.firstName} ${post.lastName}`.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory]);

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Search Results ({filteredPosts.length})
        </h2>
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {searchQuery && (
              <Badge variant="secondary">Search: "{searchQuery}"</Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">Category: {selectedCategory}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link key={post._id} href={`/blogs/${post._id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-xs">{post.category}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {stripHtmlTags(post.text).split(" ").slice(0, 15).join(" ") +
                    "..."}
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={post.pictureUrl || "/placeholder.svg"}
                      alt={`${post.firstName} ${post.lastName}`}
                    />
                    <AvatarFallback>{post.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {post.firstName} {post.lastName}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
