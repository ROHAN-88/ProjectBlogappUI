"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type BlogPost = {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  image: string
  createdAt: Date
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const { toast } = useToast()

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("blogPosts")
    if (savedPosts) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }))
        setPosts(parsedPosts)
      } catch (error) {
        console.error("Failed to parse saved posts:", error)
      }
    }
  }, [])

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter((post) => post.id !== id)
      // Save updated posts to localStorage
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
      return updatedPosts
    })

    toast({
      title: "Post deleted",
      description: "The blog post has been successfully deleted.",
    })
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No posts yet. Create your first post above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">
                  By {post.author.name} • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-line">{post.content}</p>
            {post.image && (
              <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={`Image for ${post.title}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(post.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
