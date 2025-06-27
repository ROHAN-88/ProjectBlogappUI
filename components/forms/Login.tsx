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

const formSchema = z.object({
  email: z
    .string({ required_error: "Email cannot be blank" })
    .email({ message: "Invalid Email" }),
  password: z.string({ required_error: "Password cannot be blank" }),
});

export type LoginFormValue = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

          <Button disabled={isLoading} className="ml-auto w-full" type="submit">
            {isLoading ? <Spinner sm /> : "Login"}
          </Button>
        </form>
      </Form>

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
