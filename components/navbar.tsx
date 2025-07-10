"use client";

import logodark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { userTypes } from "@/types/userTypes";
import { GetUserDetail, logoutApiAction } from "@/utils/apiUtils";
import { Home, PenSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SearchBar } from "./search-bar";

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

  const router = useRouter();
  const handleLogout = async () => {
    await logoutApiAction();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logoLight || "/placeholder.svg"}
            alt="Logo"
            width={65}
            className="block dark:hidden"
          />
          <Image
            src={logodark || "/placeholder.svg"}
            alt="Logo"
            width={65}
            className="hidden dark:block"
          />
        </Link>

        {/* Search Bar - Only show on home page */}
        {pathname === "/" && (
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <SearchBar />
          </div>
        )}

        {/* Navigation + User Actions */}
        <div className="flex items-center space-x-2">
          <nav className="hidden sm:flex items-center space-x-2">
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
              variant={pathname === "/blogs" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/blogs" className="flex items-center space-x-1">
                <PenSquare className="h-4 w-4" />
                <span>Create</span>
              </Link>
            </Button>
          </nav>

          {/* Mobile Search Bar */}
          {pathname === "/" && (
            <div className="md:hidden">
              <SearchBar />
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user.pictureUrl || "/placeholder.svg"}
                    alt={user.fullName || "User"}
                  />
                  <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <Link href={`/profile/${user?.id}`}>
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                </Link>
                <Link href="/editProfile">
                  <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
