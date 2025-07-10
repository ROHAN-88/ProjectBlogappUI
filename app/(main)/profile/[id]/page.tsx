"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import { useBlogContext } from "@/components/providers/BlogProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/types/blogPostType";
import { userTypes } from "@/types/userTypes";
import {
  GetPostByUId,
  GetSavedPost,
  GetUserDetailById,
  PostDelete,
} from "@/utils/apiUtils";
import DOMPurify from "dompurify";
import { BookmarkIcon, Grid, MessageSquare, Settings } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [profileUser, setProfileUser] = useState<userTypes>();
  const [selectedPostId, setSelectedPostId] = useState("");
  const { triggerRefetch, refetch } = useBlogContext();

  const isUserProfile = document.cookie
    .split("; ")
    .find((row) => row.startsWith("UserEmail"))
    ?.split("=")[1];

  // Load profile data - separate from posts loading
  useEffect(() => {
    const getUserDetail = async () => {
      const userDetail = await GetUserDetailById(id);
      if (userDetail?.success === true) {
        setProfileUser(userDetail.data);
      }
    };
    getUserDetail();
  }, []);

  // Load posts separately from profile data
  useEffect(() => {
    const getSavedPost = async () => {
      const response = await GetSavedPost(id);
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
        const response = await GetPostByUId(id);
        if (response?.success === true) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error");
      }
    };
    userPostData();
  }, [refetch]);

  const handelDelete = async (id: string) => {
    const response = await PostDelete(id);
    if (response?.success === true) {
      triggerRefetch();
      toast(response.data);
    } else {
      toast(response?.data);
    }
  };
  if (!profileUser) {
    return (
      <div className="container mx-auto py-8 px-4">Loading profile...</div>
    );
  }

  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    return div.textContent || "";
  }
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="h-24 w-24 md:h-36 md:w-36 ">
          <AvatarImage
            src={profileUser.pictureUrl}
            alt={profileUser.fullName}
            className="object-cover"
          />
          <AvatarFallback>
            {profileUser.fullName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{profileUser.fullName}</h1>

            {decodeURIComponent(isUserProfile || "") === profileUser.email ? (
              <Link href={`/editProfile`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
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
              <span className="font-semibold">{posts.length}</span>
              <p className="text-sm text-muted-foreground">posts</p>
            </div>
            {/* <div className="text-center">
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
            </div>*/}
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
          <AlertDialog>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                  >
                    <Card className="relative w-full h-full overflow-hidden group cursor-pointer rounded-xl">
                      {/* Image */}
                      <Image
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.title || " "}
                        fill
                        className="object-cover"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center">
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                        <p className="text-sm mb-6">
                          {stripHtmlTags(post.text)
                            .split(" ")
                            .slice(0, 15)
                            .join(" ") + "..."}
                          {/* {post.text.split(" ").slice(0, 15).join(" ")} ... */}
                        </p>
                        <div className="flex gap-2">
                          <Link href={`/blogs/${post._id}`}>
                            <Button className="px-4 py-2">Read</Button>
                          </Link>

                          {/* Trigger dialog and set selected post */}
                          {decodeURIComponent(isUserProfile || "") ===
                            profileUser.email && (
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  setSelectedPostId(post?._id || "")
                                }
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No posts yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/blogs">Create Your First Post</Link>
                </Button>
              </div>
            )}

            {/* Shared Dialog for Deletion */}
            <AlertDialogContent className="bg-[#3C3D37]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete the
                  post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#686D76]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (selectedPostId) {
                      handelDelete(selectedPostId);
                      setSelectedPostId(""); // reset after action
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPosts.map((post) => (
              <div
                className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                key={post._id}
              >
                <Card className="relative w-full h-full overflow-hidden group cursor-pointer rounded-xl">
                  {/* Background Image */}
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title || " "}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay (hidden by default, visible on hover) */}
                  <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300  flex flex-col justify-center items-center  text-center">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <p className="text-sm mb-6">
                      {stripHtmlTags(post.text)
                        .split(" ")
                        .slice(0, 15)
                        .join(" ") + "..."}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/blogs/${post._id}`} key={post._id}>
                        <Button className=" px-4 py-2 ">Read</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
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
