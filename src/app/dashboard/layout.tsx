import { SidebarProvider } from "@/components/ui/sidebar";
import { getPlaygroundForUser } from "@/features/dashboard/server";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  //data fetching
  const playgroundData = await getPlaygroundForUser();

  // Store icon names (strings) instead of the components themselves
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  };

  //data transformation
  const formattedData = playgroundData.success && playgroundData.playgrounds ?
    playgroundData.playgrounds.map((playground) => ({
      id: playground.id,
      name: playground.title,
      icon: technologyIconMap[playground.template] || "Code",
      starred: playground.isBookmarkedByUser || false,


    })) : [];

  if (!playgroundData.success) {
    console.error("Failed to load playgrounds:", playgroundData.error);
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full overflow-hidden'>

        <DashboardSidebar initialPlaygroundData={formattedData} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
