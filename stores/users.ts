import { User } from "@/models/users";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// immer is a middleware that allows us to mutate the state directly
// reference: https://zustand.docs.pmnd.rs/integrations/immer-middleware
const useUsersStore = create<UserStore>()(
  immer((set) => ({
    user: null,
    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),
  })),
);

export default useUsersStore;
