import { createContext, type ReactNode } from "react";
import type { UserType } from "../Types/ProfileUser.type";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type UserProfileType = {
  myProfileData: UserType | undefined;
  userId: string | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

export const UserProfileContext = createContext<UserProfileType>({
  myProfileData: undefined,
  userId: undefined,
  isPending: true,
  isError: false,
  error: null,
});

function getMyProfile() {
  return axios.get("https://route-posts.routemisr.com/users/profile-data", {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  });
}

export default function UserProfileProvider({ children }: { children: ReactNode }) {
  const { data, isPending, isError, error } = useQuery({
    queryFn: getMyProfile,
    queryKey: ["getMyProfile"],
    enabled: !!localStorage.getItem("userToken"),
  });

  const myProfileData: UserType | undefined = data?.data?.data?.user;
  const userId = myProfileData?._id;

  return (
    <UserProfileContext.Provider
      value={{ myProfileData, userId, isPending, isError, error }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}