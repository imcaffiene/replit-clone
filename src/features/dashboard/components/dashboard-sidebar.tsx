"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Code2,
  Compass,
  Database,
  FlameIcon,
  FolderPlus,
  History,
  HomeIcon,
  LayoutDashboardIcon,
  Lightbulb,
  LucideIcon,
  PlusIcon,
  Settings2,
  StarIcon,
  Terminal,
  Zap,
} from "lucide-react";


interface Props {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIcons: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Lightbulb,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2,
};

export const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: Props[];
}) => {
  const pathname = usePathname();
  // holds only the starred playgrounds from your initial data
  const [starredPlaygrounds, setStarredPlaygrounds] = useState(
    initialPlaygroundData?.filter((p) => p.starred) ?? []
  );
  // holds all playgrounds from your initial data
  const [recentPlaygrounds, setRecentPlaygrounds] = useState(
    initialPlaygroundData || []
  );

  return (
    <Sidebar
      variant='inset'
      collapsible='icon'
      className='border-1 border-r'>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-3 justify-center '>
          <Image
            src={"/logo.svg"}
            alt='logo'
            width={60}
            height={60}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={"Home"}
              >
                <Link href={"/"}>
                  <HomeIcon className='size-4' />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip={"Dashboard"}
              >
                <Link href={"/dashboard"}>
                  <LayoutDashboardIcon className='h-4 w-4' />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <StarIcon className='size-4 mr-2' />
            Starred
          </SidebarGroupLabel>

          <SidebarGroupAction title='Add Starred Playground'>
            <PlusIcon className='size-4' />
          </SidebarGroupAction>



          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 &&
                recentPlaygrounds.length === 0 ? (
                <div className='text-center text-muted-foreground py-4 w-full'>
                  Create your playground.
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComp = lucideIcons[playground.icon] ?? Code2;

                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`}>
                          {IconComp && <IconComp className='size-4' />}
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="h-4 w-4 mr-2" /> Recent
          </SidebarGroupLabel>

          <SidebarGroupAction title="Create a new playground">
            <FolderPlus className="h-4 w-4" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0 ? null : (
                recentPlaygrounds.map((playground) => {
                  const IconComp = lucideIcons[playground.icon] ?? Code2;

                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`}>
                          {IconComp && <IconComp className='size-4' />}
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"View all"}>
                  <Link href={"/playground"}>
                    <span className="text-sm text-muted-foreground">
                      View all playground
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Settings"}>
              <Link href={"/settings"}>
                <Settings2 className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar >
  );
};

