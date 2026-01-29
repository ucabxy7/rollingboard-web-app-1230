"use client";

import { Button } from "./shared/button";
import { useTranslations } from "next-intl";
import Cross from "@/public/svgs/cross.svg";
import { Project } from "@/models/projects";

type ProjectCardProps = {
  project: Project;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ProjectCard = ({
  project,
  onOpen,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  const t = useTranslations();
  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 
    bg-linear-to-b from-dark-9 to-transparent max-w-[300px]
    border border-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-200 min-h-[200px]"
    >
      <button
        className="absolute top-4 right-4 size-4 z-10 opacity-0 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Cross className="text-white size-4" />
      </button>
      <div className="space-y-2 text-center ">
        <h2 className="text-white text-large font-semibold ">{project.name}</h2>
        <p className="text-small text-gray-3">{project.description}</p>
      </div>

      <div className="mt-4 flex items-center gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          onClick={onOpen}
          className="px-6 py-1.5 font-semibold hover:bg-dark-4 transition-colors"
        >
          {t("projectsScreen.open")}
        </Button>
        <Button
          onClick={onEdit}
          className="px-6 py-1.5 font-semibold hover:bg-dark-4 transition-colors"
        >
          {t("projectsScreen.edit")}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
