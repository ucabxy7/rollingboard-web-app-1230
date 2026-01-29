import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useTranslations } from "next-intl";
import ProjectForm from "./form/createProjectForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData, Project } from "@/models/projects";
import { useCallback, useImperativeHandle, useState } from "react";
import Cross from "@/public/svgs/cross.svg";

export interface ProjectDialogRef {
  open: (editProject?: Project | null) => void;
  close: () => void;
}
interface ProjectDialogProps {
  isEdit?: boolean;
  editProject?: Project | null;
  onSuccess?: () => void;
  ref: React.RefObject<ProjectDialogRef | null>;
}

const ProjectDialog = ({
  isEdit = false,
  editProject,
  onSuccess,
  ref,
}: ProjectDialogProps) => {
  const t = useTranslations();
  const createProjectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: (editProject?: Project | null) => {
        if (editProject) {
          createProjectForm.reset({
            name: editProject.name ?? "",
            description: editProject.description ?? "",
          });
        } else {
          // Clear form for new project
          createProjectForm.reset({
            name: "",
            description: "",
          });
        }
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [createProjectForm],
  );

  const handleSuccess = useCallback(() => {
    setIsOpen(false);
    onSuccess?.();
  }, [setIsOpen, onSuccess]);

  return (
    <>
      <Dialog
        open={isOpen}
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpen(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-dark-9 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-h4 font-bold text-white mb-6"
              >
                {isEdit
                  ? t("projectsScreen.editProject")
                  : t("projectsScreen.createProject")}
              </DialogTitle>
              <button
                className="absolute top-4 right-4 size-4 z-10 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <Cross className="text-white size-4" />
              </button>
              <ProjectForm
                form={createProjectForm}
                onSuccess={handleSuccess}
                isEdit={isEdit}
                projectId={editProject?.id}
              />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProjectDialog;
