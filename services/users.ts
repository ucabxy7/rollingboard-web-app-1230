import { User } from "@/models/users";
import { getCommonHeaders, handleApiResponse } from "./base";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async () => {
  const headers = await getCommonHeaders();
  const url = `${API_URL}/users/me`;

  const response = await handleApiResponse<{ user: User }>(
    await fetch(url, { headers }),
  );
  return response.user;
};
