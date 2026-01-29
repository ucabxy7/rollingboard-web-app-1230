import { Button } from "../shared/button";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "@/models/projects";
import Input from "../shared/input";
import { createProject, updateProject } from "@/services/projects";

type ProjectFormProps = {
  onSuccess?: () => void;
  form: UseFormReturn<ProjectFormData>;
  isEdit?: boolean;
  projectId?: string;
};

const ProjectForm = ({
  form,
  onSuccess,
  isEdit = false,
  projectId,
}: ProjectFormProps) => {
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEdit && projectId) {
        await updateProject(projectId, data);
      } else {
        await createProject(data);
      }
      onSuccess?.();
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4">
      <div className="flex flex-col gap-4 mb-6">
        <Input
          id="name"
          type="text"
          label={t("projectsScreen.name")}
          placeholder={t("projectsScreen.name")}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="description"
          type="text"
          label={t("projectsScreen.description")}
          placeholder={t("projectsScreen.description")}
          error={errors.description?.message}
          {...register("description")}
        />
        <div className="flex justify-center">
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isEdit
              ? t("projectsScreen.editProjectButton")
              : t("projectsScreen.createProjectButton")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;
