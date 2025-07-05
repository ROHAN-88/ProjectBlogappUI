"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "../ui/input";
import { registerApiAction } from "@/utils/apiUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    email: z
      .string({ required_error: "Email cannot be blank" })
      .email({ message: "Invalid Email format" })
      .refine((val) => val.includes("@") && val.endsWith(".com"), {
        message: "Email must include '@' and end with '.com'",
      }),
    password: z
      .string({ required_error: "Password cannot be blank" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: "Password must include at least one special character",
      }),
    confirm_password: z.string({ required_error: "Please confirm password" }),
    firstName: z
      .string({ required_error: "First name cannot be blank" })
      .refine((val) => !/\d/.test(val), {
        message: "First name cannot contain numbers",
      }),
    lastName: z
      .string({ required_error: "Last name cannot be blank" })
      .refine((val) => !/\d/.test(val), {
        message: "Last name cannot contain numbers",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterFormValue = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: RegisterFormValue) => {
    try {
      setIsLoading(true);
      form.clearErrors();
      const validatedData = formSchema.parse(values);

      const response = await registerApiAction(validatedData);
      if (response.success) {
        toast("Registered successfully", {
          description: "Your account has been created.",
        });
        router.push("/login");
      } else if (response.errors) {
        Object.entries(response.errors).forEach(([field, message]) => {
          form.setError(field as keyof RegisterFormValue, {
            type: "server",
            message: Array.isArray(message) ? message.join(", ") : message,
          });
        });
      }
    } catch {
      form.setError("email", {
        message: "An unexpected error occurred. Please try again.",
      });
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
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          {/* Password Field with visibility toggle */}
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

          {/* Confirm Password Field with toggle */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="********"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="ml-auto w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "link" }))}
          >
            Login here
          </Link>
        </p>
      </div>
    </>
  );
}
