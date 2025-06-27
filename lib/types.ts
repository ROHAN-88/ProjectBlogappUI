export type Author = {
  name: string
  avatar: string
}

export type Post = {
  id: string
  title: string
  content: string
  author: Author
  image: string
  createdAt: Date
}
