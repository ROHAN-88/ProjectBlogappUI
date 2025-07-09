"use client";
import { GetBlogById } from "@/utils/apiUtils";
import { use, useEffect, useState } from "react";
import { FormDataType } from "../../model";
import EditBlog from "../components/EditBlog";

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

  return <>{blogPost && <EditBlog defaultValues={blogPost} id={id} />}</>;
};

export default page;
