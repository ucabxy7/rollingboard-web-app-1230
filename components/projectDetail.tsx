"use client";

import { useRef } from "react";
import { Button } from "./shared/button";
import MembersDialog, { MembersDialogRef } from "@/components/membersDialog";
import { useTranslations } from "next-intl";

interface ProjectDetailProps {
  projectId: string;
}
const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const membersDialogRef = useRef<MembersDialogRef | null>(null);
  const t = useTranslations();
  return (
    <div className="max-w-7xl w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-white text-2xl sm:text-3xl font-bold">Project</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => membersDialogRef.current?.open("view")}
          >
            {t("projectDetail.members")}
          </Button>
        </div>
      </div>

      {/* TODO: Replace with real project board/details */}
      <p className="text-gray-6 text-medium">
        Project board content will go here.
      </p>

      <MembersDialog ref={membersDialogRef} projectId={projectId} />
    </div>
  );
};

export default ProjectDetail;
