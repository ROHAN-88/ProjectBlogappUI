"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";

import axios from "axios";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormDataType } from "../model";
import { AddPostApi } from "@/utils/apiUtils";
import { toast } from "sonner";

const CreateBlog = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = async (data: FormDataType) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        const cloudName = "diwtmwthg";
        // creates form data object
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "hermes-mart");
        data.append("cloud_name", cloudName);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          data
        );

        imageUrl = res.data.secure_url;
      }
      data.imageUrl = imageUrl;
      const responses = await AddPostApi(data);
      if (responses?.success === true) {
        toast("Post Created", {
          description: "Post has been created",
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your post"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Content</Label>
            <Textarea
              id="text"
              placeholder="Write your post content here..."
              rows={5}
              {...register("text", { required: "Content is required" })}
            />
            {errors.text && (
              <p className="text-sm text-destructive">{errors.text.message}</p>
            )}
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
};
export default CreateBlog;
