"use client";

import React, { use } from "react";
import BlogDetail from "./components/blog-detail";

type PageProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: PageProps) => {
  const { id } = params;
  return <BlogDetail id={id} />;
};

export default Page;
