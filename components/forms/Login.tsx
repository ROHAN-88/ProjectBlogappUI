/* eslint-disable no-console */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Spinner from "../common/Spinner";
import { loginInApiAction } from "@/utils/apiUtils";

// 👁️ Icons for show/hide password
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email cannot be blank" })
    .email({ message: "Invalid Email" }),
  password: z.string({ required_error: "Password cannot be blank" }),
});

export type LoginFormValue = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ state for toggle
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<LoginFormValue>({
    email: "",
    password: "",
  });

  const form = useForm<LoginFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: LoginFormValue) => {
    setIsLoading(true);
    try {
      const validatedData: LoginFormValue = formSchema.parse(values);
      const response = await loginInApiAction(validatedData);
      if (response?.success) {
        router.push("/");
      } else {
        toast({
          description: response?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      form.setError("root", { message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email..."
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field with Show/Hide */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="********"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button disabled={isLoading} className="ml-auto w-full" type="submit">
            {isLoading ? <Spinner sm /> : "Login"}
          </Button>
        </form>
      </Form>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm">
          Don&apos;t have an account?
          <Link
            href={"/register"}
            className={cn(buttonVariants({ variant: "link" }))}
          >
            Create one here
          </Link>
        </p>
      </div>
    </>
  );
}
