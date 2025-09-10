import { EmptyState } from "@/components/ui/empty-state";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getPlaygroundForUser,
  toggleFavorite,
} from "@/features/dashboard/server";
import { AddNewButton } from "@/features/dashboard/components/add-new-button";
import { AddRepoButton } from "@/features/dashboard/components/add-repo-button";
import { ProjectTable } from "@/features/dashboard/components/project-table";

const DashboardPage = async () => {

  const playground = await getPlaygroundForUser();
  const projects = playground.success ? playground.playgrounds : [];




  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {!projects || projects.length === 0 ? (

          // Empty State for first-time users
          <EmptyState
            title="No project found"
            description="Create a new project to get started."
            imageSrc="/logo.svg"
          />
        ) : (

          // Project Table with properly typed handlers
          <ProjectTable
            projects={projects}
            onDeleteProject={deleteProjectById}
            onDuplicateProject={duplicateProjectById}
            onUpdateProject={editProjectById}
            onMarkasFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
