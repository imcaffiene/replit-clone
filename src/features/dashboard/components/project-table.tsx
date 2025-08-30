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

interface ProjectTableProps {
  projects?: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string; }
  ) => Promise<void>;
  onDeleteProject?: (id: string) => Promise<void>;
  onDuplicateProject?: (id: string) => Promise<void>;

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
}: ProjectTableProps) => {
  // Add null/undefined check before mapping
  if (!projects) {
    return (
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
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                className='text-center text-gray-500 py-4'>
                No projects found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className='border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Project </TableHead>
            <TableHead> Template </TableHead>
            <TableHead> Created </TableHead>
            <TableHead> User </TableHead>
            <TableHead className='w-[50px]'> Actions </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className='flex flex-col'>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className='hover:underline'>
                    <span className='font-semibold'>{project.title}</span>
                  </Link>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={"outline"}
                  className='bg-[#E93F3F15] text-[#E93F3F] border-[#E93F3F]'>
                  {project.template}
                </Badge>
              </TableCell>

              <TableCell>
                {format(new Date(project.createdAt), "MMM dd, yyyy")}
              </TableCell>

              <TableCell>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full overflow-hidden'>
                    <Image
                      src={project.user.image}
                      alt={project.user.name}
                      width={32}
                      height={32}
                      className='object-cover'
                    />
                  </div>
                  <span className='text-sm'>{project.user.name}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
