import { Navbar } from "@/components/navbar";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const layout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />

      <div className="container px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
};

export default layout;
