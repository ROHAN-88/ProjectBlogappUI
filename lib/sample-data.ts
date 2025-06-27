import { v4 as uuidv4 } from "uuid"
import type { BlogPost } from "@/components/blog/blog-posts"

export function generateSamplePosts() {
  // Check if posts already exist in localStorage
  const existingPosts = localStorage.getItem("blogPosts")
  if (existingPosts && JSON.parse(existingPosts).length > 0) {
    return // Don't generate sample posts if posts already exist
  }

  // Sample user data
  const sampleUser = {
    id: "user-1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
  }

  // Ensure user exists in localStorage
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(sampleUser))
  }

  // Sample posts data
  const samplePosts: BlogPost[] = [
    {
      id: uuidv4(),
      title: "My Trip to the Mountains",
      content:
        "Just got back from an amazing hiking trip in the mountains. The views were breathtaking and the air was so fresh. I took some amazing photos that I wanted to share with everyone.\n\nWe hiked for about 6 hours each day and camped under the stars. The experience was truly unforgettable and I can't wait to go back next year.",
      userId: sampleUser.id,
      author: {
        name: sampleUser.name,
        avatar: sampleUser.avatar,
      },
      image: "/placeholder.svg?height=600&width=800",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: uuidv4(),
      title: "Delicious Homemade Pasta Recipe",
      content:
        "I tried making homemade pasta for the first time yesterday and it turned out amazing! Here's the recipe I used:\n\n- 2 cups all-purpose flour\n- 3 large eggs\n- 1 tablespoon olive oil\n- 1/2 teaspoon salt\n\nMix all ingredients until you form a dough, then knead for about 10 minutes. Let it rest for 30 minutes, then roll it out and cut into your desired pasta shape. Cook in boiling water for 2-3 minutes and enjoy with your favorite sauce!",
      userId: sampleUser.id,
      author: {
        name: sampleUser.name,
        avatar: sampleUser.avatar,
      },
      image: "/placeholder.svg?height=600&width=800",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: uuidv4(),
      title: "My New Photography Project",
      content:
        "I've started a new photography project focusing on urban landscapes at night. The way the city lights reflect off buildings and streets creates such a magical atmosphere.\n\nI've been experimenting with long exposure shots to capture light trails from cars and really bring the scenes to life. It's challenging but so rewarding when you get that perfect shot.",
      userId: sampleUser.id,
      author: {
        name: sampleUser.name,
        avatar: sampleUser.avatar,
      },
      image: "/placeholder.svg?height=600&width=800",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
      id: uuidv4(),
      title: "Book Review: The Midnight Library",
      content:
        "I just finished reading 'The Midnight Library' by Matt Haig and I can't recommend it enough. The story follows Nora Seed who finds herself in a library between life and death, with each book representing a different version of her life if she had made different choices.\n\nIt's a beautiful exploration of regret, possibility, and what makes a life worth living. The writing is accessible yet profound, and I found myself highlighting passage after passage. Definitely a 5-star read for me.",
      userId: sampleUser.id,
      author: {
        name: sampleUser.name,
        avatar: sampleUser.avatar,
      },
      image: "/placeholder.svg?height=600&width=800",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      id: uuidv4(),
      title: "Learning to Play the Guitar",
      content:
        "I started learning to play the guitar three months ago, and I wanted to share my progress. It's been challenging but incredibly rewarding.\n\nI practice for about 30 minutes every day, focusing on basic chords and simple songs. My fingertips were sore at first, but they've toughened up now. I can play a few songs all the way through, which feels amazing!\n\nIf you're thinking about learning an instrument, my advice is to just start and be consistent with practice. Even a little bit each day adds up over time.",
      userId: sampleUser.id,
      author: {
        name: sampleUser.name,
        avatar: sampleUser.avatar,
      },
      image: "/placeholder.svg?height=600&width=800",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    },
  ]

  // Save sample posts to localStorage
  localStorage.setItem("blogPosts", JSON.stringify(samplePosts))
}
