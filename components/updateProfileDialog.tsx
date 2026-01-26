"use client";
import { UpdateProfileDialogController } from "@/utils/updateProfileDialogController";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Cross from "@/public/svgs/cross.svg";
import { UpdateProfileFormData, updateProfileSchema } from "@/models/users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUsersStore from "@/stores/users";
import UpdateProfileForm from "@/components/form/updateProfileForm";
import { fetchCurrentUser } from "@/services/users";
import { useShallow } from "zustand/shallow";

export interface UpdateProfileDialogRef {
  open: () => Promise<boolean>;
  close: () => void;
}

const UpdateProfileDialog = () => {
  const { user, setUser } = useUsersStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    })),
  );

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  const ref = useRef<UpdateProfileDialogRef | null>(null);
  const promiseRef = useRef<(value: boolean) => void | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = useCallback(async () => {
    try {
      const user = await fetchCurrentUser();
      setUser(user);
      setIsOpen(false);
    } catch (error) {
      const bugsnag = (
        globalThis as {
          Bugsnag?: { notify?: (error: Error) => void };
        }
      ).Bugsnag;
      if (bugsnag?.notify) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        bugsnag.notify(normalizedError);
      }
      console.error(error);
    }
    promiseRef.current?.(true);
  }, [setUser]);

  const handleErrorOrClose = useCallback(() => {
    promiseRef.current?.(false);
    setIsOpen(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: async () =>
        await new Promise((resolve) => {
          setIsOpen(true);
          promiseRef.current = resolve;
        }),
      close: () => setIsOpen(false),
    }),
    [],
  );

  useLayoutEffect(() => {
    UpdateProfileDialogController.init(ref);
  }, [ref]);

  // Reset form values when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        name: user.username ?? "",
        email: user.email ?? "",
      });
    }
  }, [isOpen, user, form]);

  return (
    <Dialog open={isOpen} onClose={handleErrorOrClose}>
      <DialogPanel className="fixed left-0 top-0 size-full bg-black/40 flex justify-center items-center">
        <div className="relative w-md p-10 pt-15 flex flex-col gap-7 rounded-xl border border-dark-8 bg-dark-9">
          <button
            className="absolute top-4 right-4 size-4 z-10"
            onClick={handleErrorOrClose}
          >
            <Cross className="text-white size-4" />
          </button>

          {/* contents */}
          <UpdateProfileForm form={form} onSuccess={handleSuccess} />
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default UpdateProfileDialog;
