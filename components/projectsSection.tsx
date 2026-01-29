"use client";
import { useRouter } from "next/navigation";
import ProjectCard from "./projectCard";
import { useTranslations } from "next-intl";
import { Button } from "./shared/button";
import PlusSignIcon from "@/public/svgs/plus-sign.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import ProjectDialog, { ProjectDialogRef } from "./projectDialog";
import { Project } from "@/models/projects";
import { deleteProject, fetchProjects } from "@/services/projects";
import { Pagination } from "@heroui/pagination";
import { mergeTwClasses } from "@/utils/styles/tailwindCss";

const PAGE_SIZE = 8;

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const projectDialogRef = useRef<ProjectDialogRef | null>(null);

  const router = useRouter();
  const t = useTranslations();

  const fetchAndSetProjects = useCallback(async () => {
    try {
      const { projects, pagination } = await fetchProjects(page, PAGE_SIZE);
      setTotalItems(pagination.totalItems);
      setTotalPages(pagination.totalPages);
      setProjects(projects);
      setIsLoading(false);
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
    }
  }, [page, setTotalItems, setTotalPages, setProjects, setIsLoading]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchAndSetProjects();
  }, [page, fetchAndSetProjects]);

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      await deleteProject(projectId);
      fetchAndSetProjects();
    },
    [fetchAndSetProjects],
  );
  console.log(totalPages);
  console.log(page);
  console.log(totalItems);
  return (
    <div className={mergeTwClasses(`${isLoading ? "opacity-0" : ""}`, "w-7xl")}>
      <div className="mb-6 flex justify-between w-full">
        <h1 className="text-white text-x-large sm:text-3xl font-bold">
          {t("projectsScreen.projects")}
          <span className="text-gray-6 text-x-small sm:text-large ml-1">
            ({totalItems})
          </span>
        </h1>
        <Button
          onClick={() => {
            projectDialogRef.current?.open(null);
            setIsEdit(false);
            setEditProject(null);
          }}
        >
          <PlusSignIcon className="size-4 mr-2 fill-white" />
          {t("projectsScreen.newProject")}
        </Button>
      </div>

      <div className="py-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => router.push(`/app/projects/${project.id}`)}
            onDelete={() => handleDeleteProject(project.id)}
            onEdit={() => {
              projectDialogRef.current?.open(project);
              setIsEdit(true);
              setEditProject(project);
            }}
          />
        ))}
      </div>
      {totalPages > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            showControls
            page={page}
            total={totalPages}
            onChange={setPage}
            classNames={{
              wrapper: "overflow-x-auto no-scrollbar",
            }}
          />
        </div>
      )}
      <ProjectDialog
        onSuccess={fetchAndSetProjects}
        ref={projectDialogRef}
        isEdit={isEdit}
        editProject={editProject}
      />
    </div>
  );
};

export default ProjectsSection;
