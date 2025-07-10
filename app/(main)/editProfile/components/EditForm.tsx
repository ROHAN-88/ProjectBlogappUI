"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { EditUserDetail } from "@/utils/apiUtils";
import { toast } from "sonner";

const editSchema = z.object({
  fullName: z.string().optional(),
  // .min(1, "Full Name is required")
  // .refine((val) => val.trim().split(" ").length >= 2, {
  //   message: "Please enter at least first and last name",// })
  // password: z
  //   .string()
  //   .optional()
  //   .refine((val) => !val || val.length >= 8, {
  //     message: "Password must be at least 8 characters",
  //   })
  //   .refine((val) => !val || /[a-z]/.test(val), {
  //     message: "Must include lowercase letter",
  //   })
  //   .refine((val) => !val || /[A-Z]/.test(val), {
  //     message: "Must include uppercase letter",
  //   })
  //   .refine((val) => !val || /[^a-zA-Z0-9]/.test(val), {
  //     message: "Must include special character",
  //   }),
  // confirm_password: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  pictureUrl: z.string().optional(),
});
// .refine((data) => data.password === data.confirm_password, {
//   message: "Passwords do not match",
//   path: ["confirm_password"],
// });

export type EditFormValue = z.infer<typeof editSchema>;

type propsType = {
  defaultValues: EditFormValue;
  id: string;
};

export default function EditProfileForm({ defaultValues, id }: propsType) {
  const router = useRouter();
  const form = useForm<EditFormValue>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: `${defaultValues.fullName || ""}`,
      email: defaultValues.email || "",
      // password: "",
      // confirm_password: "",
      bio: defaultValues.bio || "",
      pictureUrl: defaultValues.pictureUrl || "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues.pictureUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const onSubmit = async (values: EditFormValue) => {
    try {
      let pictureUrl = values.pictureUrl;
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
        pictureUrl = res.data.secure_url;
      }
      if (values.fullName) {
        const [firstName, ...rest] = values?.fullName.trim().split(" ");
        const lastName = rest.join(" ");

        const response = await EditUserDetail(id, {
          firstName,
          lastName,
          // password: values.password || undefined,
          email: values.email,
          bio: values.bio,
          pictureUrl: pictureUrl,
        });

        if (response?.success === true) {
          toast("user Detail Edited");
        }
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded-md"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="space-y-2">
          <FormLabel>Profile Picture</FormLabel>
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
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
