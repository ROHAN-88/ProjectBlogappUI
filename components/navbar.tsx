"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, PenSquare, User } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import logodark from "@/assets/logo-dark.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GetUserDetail } from "@/utils/apiUtils";
import { userTypes } from "@/types/userTypes";
export function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<userTypes>();
  useEffect(() => {
    const userprofile = async () => {
      const response = await GetUserDetail();

      if (response?.success === true) {
        setUser(response.data);
      }
    };
    userprofile();
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoLight}
              alt="Logo"
              width={65}
              className="light:inline-block dark:hidden"
            />

            <Image
              src={logodark}
              alt="Logo"
              width={65}
              className="hidden dark:inline-block"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button
              variant={pathname === "/blog" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/blogs" className="flex items-center space-x-1">
                <PenSquare className="h-4 w-4" />
                <span>Create </span>
              </Link>
            </Button>
            {user && (
              <Button
                variant={
                  pathname === `/profile/${user.id}` ? "default" : "ghost"
                }
                size="sm"
                asChild
              >
                <Link href={`/profile`} className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            )}
            <ThemeToggle />
            {/* {user ? (
              <Link href={`/profile/${user.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={user.name || user.username || "User"}
                  />
                  <AvatarFallback>
                    {user.name?.substring(0, 2) ||
                      user.username?.substring(0, 2) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )} */}
          </nav>
        </div>
      </div>
    </header>
  );
}
