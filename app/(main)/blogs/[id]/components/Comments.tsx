"use client";
import { useBlogContext } from "@/components/providers/BlogProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blogPostType";
import { userTypes } from "@/types/userTypes";
import { DeleteComment, GetUserDetail, PostComments } from "@/utils/apiUtils";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactSimpleWysiwyg, { ContentEditableEvent } from "react-simple-wysiwyg";
import { toast } from "sonner";

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
        setCommentValue("");
        triggerRefetch();
      }
    } else {
      console.error("No Blog ID Found");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const DeletComment = await DeleteComment(blogData?._id || "", commentId);
    if (DeletComment?.success === true) {
      triggerRefetch();
      toast("Comment Deleted");
    }
  };
  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold ">Comments</h2>

      <div className="w-full">
        <div>
          <div className="w-full">
            {/* Comment Input */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Avatar */}
              <Avatar className="w-10 h-10 border">
                <AvatarImage
                  src={profileUser?.pictureUrl}
                  alt={profileUser?.fullName || "User"}
                />
                <AvatarFallback>
                  {profileUser?.fullName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              {/* WYSIWYG & Button */}
              <div className="flex-1 w-full">
                <ReactSimpleWysiwyg
                  value={commentValue}
                  onChange={handleChangeComments}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={() => handleSubmitComment(commentValue || "")}
                    className="flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </Button>
                </div>
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
                <div className="flex justify-between items-center">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.text || " "),
                    }}
                    className="rounded p-2 text-justify"
                  />

                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteComment(item._id)}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
