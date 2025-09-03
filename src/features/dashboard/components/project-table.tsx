"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "../types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit3, ExternalLink, MoreHorizontal } from "lucide-react";
import { MarkedToggleButton } from "./toggle-star";
import { useState } from "react";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string; }
  ) => Promise<void>;
  onDeleteProject?: (id: string) => Promise<void>;
  onDuplicateProject?: (id: string) => Promise<void>;
  onMarkasFavorite?: (id: string) => Promise<void>;
}

interface EditProjectData {
  title: string;
  description: string;
}

export const ProjectTable = ({
  projects,
  onDeleteProject,
  onDuplicateProject,
  onUpdateProject,
  onMarkasFavorite,
}: ProjectTableProps) => {

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEditClick = (project: Project) => {

  };

  return (
    <>
      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>User</TableHead>
              <TableHead className='w-[50px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/**
           * Table body with project data rows
           */}
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                {/**
                 * Project title and description cell
                 * - Clickable title links to project
                 * - Description shown in muted text
                 */}
                <TableCell className='font-medium'>
                  <div className='flex flex-col'>
                    <Link
                      href={`/playground/${project.id}`}
                      className='hover:underline'>
                      <span className='font-semibold'>{project.title}</span>
                    </Link>
                    <span className='text-sm text-gray-500 line-clamp-1'>
                      {project.description}
                    </span>
                  </div>
                </TableCell>

                {/**
                 * Template badge with custom styling
                 */}
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className='bg-[#E93F3F15] text-[#22c55e] border-[#22c55e]'>
                    {project.template}
                  </Badge>
                </TableCell>

                {/**
                 * Creation date formatted for readability
                 */}
                <TableCell>
                  {format(new Date(project.createdAt), "MMM d,yyyy ")}
                </TableCell>

                {/**
                 * User information with avatar and name
                 */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full overflow-hidden'>
                      <Image
                        src={project.user.image || "/logo.svg"}
                        alt={project.user.name || "User"}
                        width={32}
                        height={32}
                        className='object-cover'
                      />
                    </div>
                    <span className='text-sm'>{project.user.name}</span>
                  </div>
                </TableCell>

                {/**
                 * Actions dropdown menu
                 */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <MarkedToggleButton
                          markedForRevision={
                            project.starmarks?.[0]?.isMarked ?? false
                          }
                          id={project.id}
                        />
                      </DropdownMenuItem>

                      {/**
                       * View project actions
                       */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`playground/${project.id}`}
                          target='_blank'
                          className='flex items-center'>
                          <ExternalLink className='h-4 w-4 mr-2' />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/**
                       * Project management actions
                       */}
                      <DropdownMenuItem>
                        <Edit3 className='h-4 w-4 mr-2' />
                        Edit Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
