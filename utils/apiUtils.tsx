"use server";

import { FormDataType } from "@/app/(main)/blogs/model";
import { LoginFormValue } from "@/components/forms/Login";
import { RegisterFormValue } from "@/components/forms/Registration";
import blogApiClient from "@/config/apiConfig";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export const loginInApiAction = async (validateData: LoginFormValue) => {
  console.log("api Login", validateData);
  const cookiesStores = await cookies();
  try {
    const response = await blogApiClient.post("/login", validateData);

    if (response.data.accesstoken) {
      cookiesStores.set("accesstoken", response.data.accesstoken, {
        maxAge: 60 * 60 * 24,
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
        maxAge: 60 * 60 * 24,
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
