'use client';

import { SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlaygroundHeader } from "@/features/playground/Layout/PlaygroundHeader";
import { useParams } from "next/navigation";


const page = () => {
  const { id } = useParams<{ id: string; }>();

  return (

    // Main Content
    <SidebarInset>
      <PlaygroundHeader />
    </SidebarInset>
  );
};

export default page;