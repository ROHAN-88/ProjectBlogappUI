"use client";

import React, { use } from "react";
import BlogDetail from "./components/blog-detail";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <BlogDetail id={id} />;
};

export default Page;
