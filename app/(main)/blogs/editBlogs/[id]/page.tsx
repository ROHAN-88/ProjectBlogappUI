"use client";
import { GetBlogById } from "@/utils/apiUtils";
import { use, useEffect, useState } from "react";
import { FormDataType } from "../../model";
import EditBlog from "../components/EditBlog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [blogPost, setBlogPost] = useState<FormDataType>();

  useEffect(() => {
    const getDetail = async () => {
      const response = await GetBlogById(id);
      if (response?.success == true) {
        setBlogPost(response.data);
      }
    };
    getDetail();
  }, []);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-xl">
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-xl">
              <Link href={`/blogs/${id}`}>blogs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl">Edit Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div
        className="w-full flex justify-center  text-4xl my-4"
        style={{ fontFamily: "Oswald" }}
      >
        Edit Blog
      </div>

      {blogPost && <EditBlog defaultValues={blogPost} id={id} />}
    </>
  );
};

export default page;
