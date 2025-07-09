import React from "react";
import CreateBlog from "./Components/CreateBlog";

const pages = () => {
  return (
    <>
      <div
        className="w-full flex justify-center  text-4xl"
        style={{ fontFamily: "Oswald" }}
      >
        Create Blog
      </div>
      <CreateBlog />
    </>
  );
};

export default pages;
