"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BlogContextType {
  refetch: boolean;
  triggerRefetch: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider = ({ children }: BlogProviderProps) => {
  const [refetch, setRefetch] = useState(false);

  const triggerRefetch = () => {
    setRefetch((prev) => !prev);
  };

  return (
    <BlogContext.Provider value={{ refetch, triggerRefetch }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useDomainContext must be used within a TaskProvider");
  }
  return context;
};
