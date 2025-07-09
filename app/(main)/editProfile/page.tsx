"use client";
import { GetUserDetailById } from "@/utils/apiUtils";
import { use, useEffect, useState } from "react";
import EditProfileForm, { EditFormValue } from "./components/EditForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const page = () => {
  const [userDetail, setUserDetail] = useState<EditFormValue>();

  const id = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userId"))
    ?.split("=")[1];

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        if (id) {
          const response = await GetUserDetailById(id);

          if (response?.success === true) {
            setUserDetail(response.data);
          }
        }
      } catch (E) {
        console.log("error", E);
      }
    };
    getUserDetail();
  }, []);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-xl">
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl">Edit Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="w-full flex justify-center  text-4xl my-4"
        style={{ fontFamily: "Oswald" }}
      >
        Edit Profile
      </div>
      {userDetail ? (
        <div className=" flex justify-center">
          <div className="w-[700px]">
            {id && <EditProfileForm defaultValues={userDetail} id={id} />}
          </div>
        </div>
      ) : (
        "Could not getUserDetail"
      )}
    </>
  );
};

export default page;
