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

const formSchema = z
  .object({
    email: z
      .string({ required_error: "Email cannot be blank" })
      .email({ message: "Invalid Email" }),
    password: z
      .string({ required_error: "Password cannot be blank" })
      .min(8, { message: "Password must be 8 character" }),
    confirm_password: z.string({ required_error: "Password cannot be blank" }),
    firstName: z.string({ required_error: "Fistname Cannot be Blank" }),
    lastName: z.string({ required_error: "Fistname Cannot be Blank" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterFormValue = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

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

      // Clear previous errors before submitting
      form.clearErrors();
      const validatedData = formSchema.parse(values);

      const response = await registerApiAction(validatedData);
      if (response.success) {
        toast("Registterer", {
          description: "Registerd",
        });
      } else {
        // Handle errors correctly by assigning them to specific fields
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, message]) => {
            form.setError(field as keyof RegisterFormValue, {
              type: "server",
              message: Array.isArray(message) ? message.join(", ") : message,
            });
          });
        }
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
                  <FormLabel>Fist Name</FormLabel>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
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
                  <Input placeholder="********" type="password" {...field} />
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
