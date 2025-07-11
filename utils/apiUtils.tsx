"use server";

import { FormDataType } from "@/app/(main)/blogs/model";
import { LoginFormValue } from "@/components/forms/Login";
import { RegisterFormValue } from "@/components/forms/Registration";
import blogApiClient from "@/config/apiConfig";
import { EditUserType } from "@/types/userTypes";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginInApiAction = async (validateData: LoginFormValue) => {
  const cookiesStores = await cookies();
  try {
    const response = await blogApiClient.post("/login", validateData);

    if (response.data.accesstoken) {
      cookiesStores.set("accesstoken", response.data.accesstoken, {
        maxAge: (60 * 60 * 24) / 2,
        httpOnly: false,
        secure: false,
        path: "/",
      });
      const decodedEmail = decodeURIComponent(response.data.user.email);
      cookiesStores.set("UserEmail", decodedEmail, {
        httpOnly: false,
        secure: true,
        path: "/",
      });

      cookiesStores.set("userId", response.data.user._id, {
        maxAge: (60 * 60 * 24) / 2,
        httpOnly: false,
        secure: false,
        path: "/",
      });

      cookiesStores.set("loggedIn", "True", {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return { success: true, message: "Loged in Sucessfully" };
    }
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const typedError = error as { response?: { data?: unknown } };
      console.error(typedError.response?.data);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
};

export async function logoutApiAction() {
  const cookiesStore = cookies();

  (await cookiesStore).delete("accesstoken");
  (await cookiesStore).delete("userId");
  (await cookiesStore).delete("UserEmail");
  (await cookiesStore).delete("loggedIn");

  // Optional: delay or do cleanup if needed

  redirect("/");
}

export const registerApiAction = async (validatedData: RegisterFormValue) => {
  try {
    const backendValue = {
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    };

    const response = await blogApiClient.post("/register", backendValue);
    console.log(
      `POST /register?email=${validatedData.email}&password=${validatedData.password}&confirm_password=${validatedData.confirm_password} 200 in XYZms`
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{
      [key: string]: string[] | string;
    }>;
    console.error(
      "Registration Error:",
      axiosError.response?.data || axiosError.message
    );

    return {
      success: false,
      message: "Registration failed. Please check the input fields.",
      errors: axiosError.response?.data || null,
    };
  }
};

export const GetUserDetail = async () => {
  try {
    const response = await blogApiClient.get("/getuserdetail");

    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: "Could Not Get User Data" };
  }
};

export const GetUserDetailById = async (id: string) => {
  try {
    const response = await blogApiClient.get(`/${id}/userDetail`);
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("error");
    return { success: false, data: "User not found" };
  }
};

export const EditUserDetail = async (id: string, values: EditUserType) => {
  try {
    const response = await blogApiClient.put(`/${id}/EditProfile`, values);

    if (response?.status === 200) {
      return { success: true, data: "Detail Edit" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, data: "CouldNot Edit " };
  }
};
export const AddPostApi = async (value: FormDataType) => {
  try {
    const response = await blogApiClient.post("/addPost", value);

    if (response.status === 200) {
      return { success: true, message: "Post Created" };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, message: "Post Could not be Created" };
  }
};

export const GetAllPost = async () => {
  try {
    const response = await blogApiClient.get("/getPosts");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, data: "Cannot Fetch Data" };
  }
};

export const getPostOfUser = async () => {
  try {
    const response = await blogApiClient.get("/getPostOfUser");
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, data: "Could not get Posts" };
  }
};

export const GetBlogById = async (id: string) => {
  try {
    const response = await blogApiClient.get(`/${id}/getPost`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("");
    return { success: false, data: "Could not get the Blog Detail" };
  }
};
export const GetPostByUId = async (id: string) => {
  try {
    const response = await blogApiClient.get(`/${id}/getPostofUserById`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("");
    return { success: false, data: "Could not get the Blog Detail" };
  }
};

export const DeleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await blogApiClient.delete(
      `/posts/${postId}/comments/${commentId}`
    );

    if (response.status === 200) {
      return { success: true, data: "Comment Deleted" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, data: "Comments Deleted" };
  }
};

export const PostSavedPost = async (id: string) => {
  try {
    const response = await blogApiClient.post(`/${id}/SavePost`);
    if (response.status === 200) {
      return { success: true, data: "Post Saved" };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, data: "Could Not Saved Post" };
  }
};

export const PostDelete = async (id: string) => {
  try {
    const response = await blogApiClient.delete(`/${id}/deletePost`);
    if (response.status === 200) {
      return { success: true, data: "Post Deleted" };
    }
  } catch (error) {
    console.log("Error", error);
    return { success: false, data: "Could not Delete" };
  }
};

export const GetSavedPost = async (id: string) => {
  try {
    const response = await blogApiClient.get(`/${id}/getSavedPost`);
    if (response.status) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, data: "Could not Get Saved Post" };
  }
};

export const GetAllSavedPost = async () => {
  try {
    const response = await blogApiClient.get(`/getAllSavedPost`);
    if (response.status) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error("Error", error);
    return { success: false, data: "Could not Get Saved Post" };
  }
};

export const UpdateBlogs = async (id: string, values: FormDataType) => {
  try {
    const response = await blogApiClient.put(`/${id}/editPost`, values);
    if (response.status === 200) {
      return { success: true, data: "Updated Post" };
    }
  } catch (error) {
    console.log("Error", error);
    return { success: false, data: "Could Not Update Post" };
  }
};

export const PostLike = async (id: string) => {
  try {
    const response = await blogApiClient.post(`${id}/like`);
    if (response.status == 200) {
      return { success: true, data: response.data };
    }
  } catch (error: any) {
    return { success: false, data: { message: error.message } };
  }
};

export const PostComments = async (id: string, value: string) => {
  try {
    const response = await blogApiClient.post(`/${id}/comments`, {
      text: value,
    });

    if (response.status === 200) {
      return { success: true, data: "Comment Posted" };
    }
  } catch (error) {
    console.log("Error", error);
  }
};
