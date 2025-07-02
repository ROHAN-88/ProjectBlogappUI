import { Hexagon } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BlogPost } from "@/types/blogPostType";
import BlogCard from "./BlogCard";
import { categoryType } from "@/app/(main)/blogs/model";

type propsTypes = {
  category: categoryType;
  label: string;
  posts: BlogPost[];
};

const CategoryCarousel = ({ category, label, posts }: propsTypes) => {
  const Postss = posts?.filter((post) => post.category === category);
  const isRecent = category === "recent";
  const hasFilteredPosts = Postss.length > 0;

  // Decide what to render
  const renderPosts = isRecent ? posts : hasFilteredPosts ? Postss : [];
  return (
    <>
      {renderPosts.length > 0 ? (
        <div className="space-y-6 mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-4 mb-4">
            <Hexagon size="30px" color="#4682A9" /> {label} Posts
          </h2>
          <Carousel orientation="horizontal">
            <CarouselContent>
              {renderPosts.map((post) => (
                <CarouselItem key={post._id} className="basis-1/4">
                  <Link href={`/blogs/${post._id}`}>
                    <BlogCard data={post} />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        !isRecent && (
          <div className="mt-10 text-center text-muted-foreground"></div>
        )
      )}
    </>
  );
};

export default CategoryCarousel;
