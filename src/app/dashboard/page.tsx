import { EmptyState } from "@/components/ui/empty-state";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getPlaygroundForUser,
} from "@/features/dashboard/actions";
import { AddNewButton } from "@/features/dashboard/components/add-new-button";
import { AddRepoButton } from "@/features/dashboard/components/add-repo-button";
import { ProjectTable } from "@/features/dashboard/components/project-table";
import { toast } from "sonner";

const DashboardPage = async () => {

  // ============================================
  // SERVER-SIDE DATA FETCHING
  // ============================================

  /**
   * Fetch user's projects on server-side
   * Benefits: SEO, faster initial load, authentication built-in
   */
  const playground = await getPlaygroundForUser();
  const projects = playground.success ? playground.playgrounds : [];

  // ============================================
  // CLIENT-SIDE EVENT HANDLERS (Type-Compatible)
  // ============================================

  /**
   * Delete Project Handler
   * 
   * Signature: (id: string) => Promise<void>
   * Matches ProjectTableProps.onDeleteProject
   * 
   * Flow:
   * 1. Receives project ID from ProjectTable
   * 2. Calls server action with ID
   * 3. Provides user feedback via toast
   */
  const handleDeleteProject = async (id: string) => {
    const result = await deleteProjectById(id);

    if (result.success) {
      toast.success("Project deleted successfully");
    } else {
      toast.error(`Error deleting project: ${result.error}`); // Fixed template literal
    }
  };

  /**
   * Duplicate Project Handler
   * 
   * Signature: (id: string) => Promise<void>
   * Matches ProjectTableProps.onDuplicateProject
   * 
   * Creates copy of existing project with "(copy)" suffix
   */
  const handleDuplicateProject = async (id: string) => {
    const result = await duplicateProjectById(id);

    if (result.success) {
      toast.success("Project duplicated successfully");
    } else {
      toast.error(`Error duplicating project: ${result.error}`); // Fixed template literal
    }
  };

  /**
   * Update Project Handler
   * 
   * Signature: (id: string, data: {title: string; description: string}) => Promise<void>
   * Matches ProjectTableProps.onUpdateProject
   * 
   * Note: The ProjectTable component handles user input via modal dialog
   * This handler just processes the final update request
   */
  const handleUpdateProject = async (
    id: string,
    data: { title: string; description: string; }
  ) => {
    const result = await editProjectById(id, data);

    if (result.success) {
      toast.success("Project updated successfully");
    } else {
      toast.error(`Error updating project: ${result.error}`); // Fixed template literal
    }
  };

  // ============================================
  // COMPONENT RENDER
  // ============================================

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
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
            onUpdateProject={handleUpdateProject}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
