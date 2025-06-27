"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { BlogPost } from "@/components/blog/blog-posts";
import { Grid, Settings, MessageSquare, BookmarkIcon } from "lucide-react";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const isOwnProfile = user?.id === params.id;

  // Load profile data - separate from posts loading
  useEffect(() => {
    // For demo purposes, if it's the current user's profile, use their data
    if (isOwnProfile && user) {
      setProfileUser({
        id: user.id,
        username: user.username || "username",
        name: user.name || "User Name",
        avatar: user.avatar || "/placeholder.svg?height=150&width=150",
        bio: "This is my bio. I love photography and sharing my thoughts on this blog.",
        postsCount: 0,
        followersCount: 1250,
        followingCount: 420,
        website: "https://example.com",
      });
    } else {
      // Mock data for other profiles
      setProfileUser({
        id: params.id,
        username: "username",
        name: "User Name",
        avatar: "/placeholder.svg?height=150&width=150",
        bio: "This is my bio. I love photography and sharing my thoughts on this blog.",
        postsCount: 0,
        followersCount: 1250,
        followingCount: 420,
        website: "https://example.com",
      });
    }
  }, [isOwnProfile, params.id, user]);

  // Load posts separately from profile data
  useEffect(() => {
    const savedPostsData = localStorage.getItem("blogPosts");
    if (savedPostsData) {
      try {
        const parsedPosts = JSON.parse(savedPostsData).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }));
        // Filter posts by user ID
        const userPosts = parsedPosts.filter(
          (post: BlogPost) => post.userId === params.id
        );
        setPosts(userPosts);

        // Load saved posts if viewing own profile
        if (isOwnProfile && user) {
          const savedPostIds = localStorage.getItem(`savedPosts-${user.id}`);
          if (savedPostIds) {
            const savedIds = JSON.parse(savedPostIds);
            const userSavedPosts = parsedPosts.filter((post: BlogPost) =>
              savedIds.includes(post.id)
            );
            setSavedPosts(userSavedPosts);
          }
        }
      } catch (error) {
        console.error("Failed to parse saved posts:", error);
      }
    }
  }, [params.id, isOwnProfile, user]);

  // Update post count in a separate effect to avoid the infinite loop
  useEffect(() => {
    if (profileUser && posts.length >= 0) {
      setProfileUser((prev) => {
        // Only update if the count has changed to avoid infinite loops
        if (prev.postsCount !== posts.length) {
          return {
            ...prev,
            postsCount: posts.length,
          };
        }
        return prev;
      });
    }
  }, [posts.length]);

  if (!profileUser) {
    return (
      <div className="container mx-auto py-8 px-4">Loading profile...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="h-24 w-24 md:h-36 md:w-36">
          <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
          <AvatarFallback>{profileUser.name.substring(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{profileUser.username}</h1>
            {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm">Follow</Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div className="text-center">
              <span className="font-semibold">{profileUser.postsCount}</span>
              <p className="text-sm text-muted-foreground">posts</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {profileUser.followersCount}
              </span>
              <p className="text-sm text-muted-foreground">followers</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {profileUser.followingCount}
              </span>
              <p className="text-sm text-muted-foreground">following</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">{profileUser.name}</h2>
            <p className="text-sm whitespace-pre-line">{profileUser.bio}</p>
            {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                {profileUser.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Tagged</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link href={`/blog/post/${post.id}`} key={post.id}>
                  <div className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No posts yet.</p>
              {isOwnProfile && (
                <Button className="mt-4" asChild>
                  <Link href="/blog">Create Your First Post</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {isOwnProfile && savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPosts.map((post) => (
                <Link href={`/blog/post/${post.id}`} key={post.id}>
                  <div className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "No saved posts yet. Save posts by clicking the bookmark icon."
                  : "This tab is only visible to the profile owner."}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" asChild>
                  <Link href="/blog">Browse Posts</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tagged" className="mt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No tagged posts yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
