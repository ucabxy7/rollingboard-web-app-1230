import useUsersStore from "@/stores/users";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
import { Button } from "./shared/button";
import { useCallback } from "react";
import { UpdateProfileDialogController } from "@/utils/updateProfileDialogController";

interface SideDrawerContentProps {
  onClose?: () => void;
}

const SideDrawerContent = ({ onClose }: SideDrawerContentProps) => {
  const t = useTranslations();
  const user = useUsersStore(useShallow((state) => state.user));

  const handleEditProfile = useCallback(async () => {
    console.log("handleEditProfile");
    onClose?.();
    await UpdateProfileDialogController.open();
  }, [onClose]);

  return (
    <div className="flex w-full flex-col gap-6 px-10">
      <div className="absolute top-0 left-0 w-full h-38 overflow-hidden bg-black">
        {/* Gradient */}
        <div className="drawer-header-gradient absolute -left-48 top-30" />
      </div>
      <div className="h-52 flex flex-row items-end gap-6 z-10">
        {/* avatar */}
        <div className="size-25 rounded-full overflow-hidden bg-amber-400"></div>
        {/* information section */}
        <div className="flex flex-col gap-1">
          <span className="text-medium font-semibold text-white">
            {user?.username}
          </span>
          <span className="text-small text-white">
            {t("sideDrawer.id", { id: user!.id })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleEditProfile} variant="default">
          {t("sideDrawer.editProfile")}
        </Button>
      </div>
      {/* Task Place Holder */}
      <div>Task Place Holder</div>
    </div>
  );
};

export default SideDrawerContent;
