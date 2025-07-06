"use client";
import { useBlogContext } from "@/components/providers/BlogProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogPost } from "@/types/blogPostType";
import { userTypes } from "@/types/userTypes";
import { GetUserDetail, PostComments } from "@/utils/apiUtils";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Send } from "lucide-react";
import { useEffect, useState } from "react";
import ReactSimpleWysiwyg, { ContentEditableEvent } from "react-simple-wysiwyg";

type PropsType = {
  blogData: BlogPost | undefined;
};

const Comments = ({ blogData }: PropsType) => {
  const [commentValue, setCommentValue] = useState<string>();
  const [profileUser, setProfileUser] = useState<userTypes>();
  const { triggerRefetch, refetch } = useBlogContext();
  const BlogPost = blogData;

  useEffect(() => {
    const getUserDetail = async () => {
      const userDetail = await GetUserDetail();
      if (userDetail?.success === true) {
        setProfileUser(userDetail.data);
      }
    };
    getUserDetail();
  }, [refetch]);

  const handleChangeComments = (e: ContentEditableEvent) => {
    setCommentValue(e.target.value);
  };

  const handleSubmitComment = async (value: string) => {
    if (BlogPost?._id && commentValue != "") {
      const response = await PostComments(BlogPost?._id, value);
      if (response?.success === true) {
        triggerRefetch();
      }
    } else {
      console.error("No Blog ID Found");
    }
  };
  return (
    <div className="w-full">
      <h2 className="mb-2 text-xl font-semibold">Comments</h2>

      <div>
        <h3 className="mb-4 font-medium">Activity</h3>
        <div className="w-full">
          <div className="mb-4 grid w-full grid-cols-4">
            <h2>Comments</h2>
          </div>

          <div className="flex gap-3">
            <Avatar className="size-8">
              <AvatarImage
                src={profileUser?.pictureUrl}
                alt={profileUser?.fullName || "User"}
              />
              <AvatarFallback>{"U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <ReactSimpleWysiwyg
                value={commentValue}
                onChange={handleChangeComments}
              />
              <div className="mt-2 flex items-center justify-end">
                <Button onClick={() => handleSubmitComment(commentValue || "")}>
                  <Send className="w-4 h-4 mr-1" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {blogData?.comment?.map((item) => {
          return (
            <div
              className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              key={item._id}
            >
              <Avatar className="w-10 h-10 border">
                <AvatarImage
                  src={item.userID || "/placeholder.svg"}
                  // alt={`${userName}'s avatar`}
                />
                <AvatarFallback className="text-sm font-medium">
                  {/* {getInitials(userName)} */}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">UserNanme</h4>

                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default Comments;
