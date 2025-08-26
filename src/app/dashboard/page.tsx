import { EmptyState } from "@/components/ui/empty-state";
import { AddNewButton } from "@/features/dashboard/components/add-new-button";
import { AddRepoButton } from "@/features/dashboard/components/add-repo-button";

const DashboardPage = () => {

  const playground: any = [];

  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <AddNewButton />

        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playground && playground.length === 0 ? (
          <EmptyState
            title="No project found"
            description="Create a new project to get started."
            imageSrc="/logo.svg" // change it customize
          />) : (
          // todo: add playgrounds table
          <p>
            Playgroundtable
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;