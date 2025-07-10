"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddPostApi } from "@/utils/apiUtils";
import axios from "axios";
import { ImagePlus, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
import { toast } from "sonner";
import { categoryType, FormDataType } from "../model";

const CreateBlog = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState<categoryType>();

  const onSubmit = async (data: FormDataType) => {
    try {
      if (!category) {
        toast.error("Please select a category");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        const cloudName = "diwtmwthg";
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "hermes-mart");
        formData.append("cloud_name", cloudName);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        imageUrl = res.data.secure_url;
      }

      data.imageUrl = imageUrl;
      data.category = category;

      const responses = await AddPostApi(data);
      if (responses?.success === true) {
        toast("Post Created", {
          description: "Post has been created",
        });
        reset();
        setImagePreview(null);
        setImageFile(null);
        setCategory("other");
      } else {
        toast.error("Failed to publish the post");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
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
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value: categoryType) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="animal">Animal</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Content</Label>
            <Controller
              name="text"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <ReactSimpleWysiwyg
                  id="text"
                  placeholder="Write your thoughts"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
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
