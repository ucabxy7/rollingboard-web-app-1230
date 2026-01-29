import { User } from "@/models/users";
import { getCommonHeaders, handleApiResponse } from "./base";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCurrentUser = async () => {
  const headers = await getCommonHeaders();
  const url = `${API_URL}/users/me`;

  const response = await handleApiResponse<{ user: User }>(
    await fetch(url, { headers }),
  );
  return response!.user;
};
export const fetchUsersByQuery = async (query: string) => {
  const headers = await getCommonHeaders();

  const url = `${API_URL}/users/search`;

  const response = await handleApiResponse<{ users: User[] }>(
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  );
  return response!.users;
};
