import { User } from "./users";

export type Membership = {
  id: string;
  projectId: string;
  userId: string;
  user: User;
};
