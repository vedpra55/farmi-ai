"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserStore } from "@/store/user-store";
import { setAuthToken } from "@/lib/axios";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const fetchUser = useUserStore((state) => state.fetchUser);
  const setToken = useUserStore((state) => state.setToken);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const initUser = async () => {
      // Only fetch if loaded and signed in
      if (isLoaded && isSignedIn) {
        const token = await getToken();
        if (token) {
          setToken(token);
          setAuthToken(token);
          fetchUser(token);
        } else {
          setToken(null);
          setAuthToken(null);
        }
      } else if (isLoaded && !isSignedIn) {
        // If not signed in, maybe clear user?
        setAuthToken(null);
        clearUser();
      }
    };

    initUser();
  }, [clearUser, fetchUser, getToken, isLoaded, isSignedIn, setToken]);

  return <>{children}</>;
};
