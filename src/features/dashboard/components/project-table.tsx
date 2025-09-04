"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlaygroundResult, Project } from "../types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format, set } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { MarkedToggleButton } from "./toggle-star";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/kibo-ui/spinner";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string; }
  ) => Promise<PlaygroundResult>;
  onDeleteProject?: (id: string) => Promise<PlaygroundResult>;
  onDuplicateProject?: (id: string) => Promise<PlaygroundResult>;
  onMarkasFavorite?: (id: string) => Promise<{ success: boolean; isMarked: boolean; error?: string; }>;
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
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [editDailogOpen, setEditDailogOpen] = useState(false);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isloading, setIsloading] = useState(false);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description,
    });
    setEditDailogOpen(true);
  };

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;

    setIsloading(true);

    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated successfully");
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error("Error duplicating project:", error);
    } finally {
      setIsloading(false);
    }
  };

  const handleCopyProjectURL = async (project: Project) => {
    const url = `${window.location.origin}/playground/${project.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied project URL to clipboard");
  };

  const handleDelete = async (project: Project) => {
    setSelectedProject(project);
    setDeleteDailogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;

    setIsloading(true);

    try {
      await onUpdateProject(selectedProject.id, editData);
      setEditDailogOpen(false);
      setSelectedProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    } finally {
      setIsloading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;

    setIsloading(true);

    try {
      await onDeleteProject(selectedProject.id);
      setDeleteDailogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    } finally {
      setIsloading(false);
    }
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

                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <MarkedToggleButton
                          markedForRevision={project.isBookmarkedByUser ?? false}
                          id={project.id}
                        />
                      </DropdownMenuItem>

                      {/**
                       * View project actions
                       */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          className='flex items-center'>
                          <Eye className='h-4 w-4 mr-2' />
                          Open Project
                        </Link>
                      </DropdownMenuItem>

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
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project)}>
                        <Edit3 className='h-4 w-4 mr-2' />
                        Edit Project
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleDuplicateProject(project)}>
                        <Copy className='h-4 w-4 mr-2' />
                        Duplicate
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleCopyProjectURL(project)}>
                        <Download className='h-4 w-4 mr-2' />
                        Copy URL
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/**
                       * Destructive delete action
                       */}
                      <DropdownMenuItem
                        onClick={() => handleDelete(project)}
                        className='text-red-600 focus:text-red-500'>
                        <Trash className='h-4 w-4 mr-2' />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/**
       * Edit Project Dialog Modal
       */}
      <Dialog
        open={editDailogOpen}
        onOpenChange={setEditDailogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 p-4'>
            <div className='grid gap-2'>
              <Label htmlFor='tittle'>Project Title</Label>
              <Input
                id='title'
                placeholder='Project Title'
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Enter project description'
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant={"outline"}
              onClick={() => setEditDailogOpen(false)}
              disabled={isloading}>
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={isloading || !editData.title.trim()}
              onClick={handleUpdateProject}>
              {
                isloading ?
                  (
                    <>
                      <Spinner variant="ellipsis" size={32} />
                    </>
                  ) :
                  (
                    "Save Changes"
                  )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/**
       * Delete Confirmation Dialog
       */}
      <AlertDialog
        open={deleteDailogOpen}
        onOpenChange={setDeleteDailogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This
              action cannot be undone. All files and data associated with this
              project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isloading}> Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isloading}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
              {
                isloading ?
                  (
                    <>
                      <Spinner variant="ellipsis" size={32} />
                    </>
                  ) :
                  (
                    "Delete"
                  )
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
