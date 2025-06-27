"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "./blog-posts";
import { ImagePlus, Loader2 } from "lucide-react";

type FormData = {
  title: string;
  content: string;
};

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      // Get existing posts from localStorage
      const existingPostsJson = localStorage.getItem("blogPosts");
      const existingPosts = existingPostsJson
        ? JSON.parse(existingPostsJson)
        : [];

      // Add new post and save back to localStorage

      // Reset form and image preview
      reset();
      setImagePreview(null);
      setImageFile(null);

      // Show success toast
      toast({
        title: "Post created",
        description: "Your blog post has been successfully published.",
      });

      // Force a reload to update the posts list
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your post"
              {...register("title", { required: "Title is required" })}
            />
            {/* {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )} */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              rows={5}
              {...register("content", { required: "Content is required" })}
            />
            {/* {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )} */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Post Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="flex items-center gap-2"
              >
                <ImagePlus className="h-4 w-4" />
                Select Image
              </Button>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <span className="text-sm text-muted-foreground">
                  Image selected
                </span>
              )}
            </div>
            {imagePreview && (
              <div className="relative h-[200px] w-full rounded-md overflow-hidden mt-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
