"use client";

import React from "react";
import BlogDetail from "./components/blog-detail";

type PageProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: PageProps) => {
  console.log("paramas", params.id);
  return <BlogDetail id={params.id} />;
};

export default Page;
