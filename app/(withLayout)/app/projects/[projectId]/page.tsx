import ProjectDetail from "@/components/projectDetail";

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  return (
    <div className="px-4 py-6 sm:px-8 lg:px-12 w-full flex justify-center">
      <ProjectDetail projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
