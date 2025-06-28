"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { BlogPost } from "@/types/blogPostType";
import { userTypes } from "@/types/userTypes";
import { getPostOfUser, GetSavedPost, GetUserDetail } from "@/utils/apiUtils";
import { BookmarkIcon, Grid, MessageSquare, Settings } from "lucide-react";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [profileUser, setProfileUser] = useState<userTypes>();

  const isUserProfile = document.cookie
    .split("; ")
    .find((row) => row.startsWith("UserEmail"))
    ?.split("=")[1];

  // Load profile data - separate from posts loading
  useEffect(() => {
    const getUserDetail = async () => {
      const userDetail = await GetUserDetail();
      if (userDetail?.success === true) {
        setProfileUser(userDetail.data);
      }
    };
    getUserDetail();
  }, []);

  // Load posts separately from profile data
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

  // Update post count in a separate effect to avoid the infinite loop
  useEffect(() => {
    const userPostData = async () => {
      try {
        const response = await getPostOfUser();
        if (response?.success === true) {
          setPosts(response.data);
        }
      } catch (error) {
        console.log("Error");
      }
    };
    userPostData();
  }, []);

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
          <AvatarImage
            src={profileUser.pictureUrl}
            alt={profileUser.fullName}
          />
          <AvatarFallback>
            {profileUser.fullName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{profileUser.fullName}</h1>
            {isUserProfile === profileUser.email ? (
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
              {/* <span className="font-semibold">{profileUser.postsCount}</span> */}
              <p className="text-sm text-muted-foreground">posts</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {/* {profileUser.followersCount} */}
              </span>
              <p className="text-sm text-muted-foreground">followers</p>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {/* {profileUser.followingCount} */}
              </span>
              <p className="text-sm text-muted-foreground">following</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">{profileUser.fullName}</h2>
            <p className="text-sm whitespace-pre-line">{profileUser.bio}</p>
            {/* {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                {profileUser.website}
              </a>
            )} */}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                // <Link href={`/blog/post/${post.id}`} key={post.id}>
                <div className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity">
                  <Card className="relative w-full h-full overflow-hidden group cursor-pointer rounded-xl">
                    {/* Background Image */}
                    <Image
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title || " "}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay (hidden by default, visible on hover) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex flex-col justify-center items-center  text-center">
                      <h2 className="text-2xl font-bold">{post.title}</h2>
                      <p className="text-sm mb-6">
                        {post.text.split(" ").slice(0, 15).join(" ")} ...
                      </p>
                      <div className="flex gap-2">
                        <Button className=" px-4 py-2 ">Read</Button>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </div>
                  </Card>
                </div>
                // </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No posts yet.</p>
              {isUserProfile === profileUser.email && (
                <Button className="mt-4" asChild>
                  <Link href="/blog">Create Your First Post</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPosts.map((post) => (
              // <Link href={`/blog/post/${post.id}`} key={post.id}>
              <div className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity">
                <Card className="relative w-full h-full overflow-hidden group cursor-pointer rounded-xl">
                  {/* Background Image */}
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title || " "}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay (hidden by default, visible on hover) */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex flex-col justify-center items-center  text-center">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <p className="text-sm mb-6">
                      {post.text.split(" ").slice(0, 15).join(" ")} ...
                    </p>
                    <div className="flex gap-2">
                      <Button className=" px-4 py-2 ">Read</Button>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </div>
                </Card>
              </div>
              // </Link>
            ))}
          </div>
          {/* ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {isUserProfile === profileUser.email
                ? "No saved posts yet. Save posts by clicking the bookmark icon."
                : "This tab is only visible to the profile owner."}
            </p>
            {isUserProfile === profileUser.email && (
              <Button className="mt-4" asChild>
                <Link href="/blog">Browse Posts</Link>
              </Button>
            )}
          </div>
          ) */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
