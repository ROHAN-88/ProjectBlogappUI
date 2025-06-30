import BlogPosts from "@/components/blog/blog-posts";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Aperture, Hexagon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className=" flex justify-between items-center  z-50 ">
          <h1 className="text-4xl font-semibold mb-4 flex items-center gap-4">
            <Aperture size="40px" color="#F6B17A" />
            Blogs
          </h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/blogs">
                  <Button variant="default">Create </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Your Blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="py-5">
          <Suspense fallback={<PostsSkeleton />}>
            <BlogPosts />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function PostsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-md mb-4" />
        </div>
      ))}
    </div>
  );
}
