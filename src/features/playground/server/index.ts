" use server";

import prisma from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/features/auth/server";

/**
 * Retrieves a playground by its ID along with template file content
 * @param id - The playground ID to fetch
 */

export const getplaygroundbyId = async (id: string) => {
  try {
    const playground = await prisma.playground.findUnique({
      where: { id },
      select: {
        id: true,
        templateFiles: {
          select: {
            content: true,
          },
        },
      },
    });
    return playground;
  } catch (error) {
    console.error("Error fetching playground:", error);
    return null;
  }
};

/**
 * SaveUpdatedCode - Server Action for Persisting Playground Template Data
 *
 * This function handles saving playground template file structures to the database
 *
 * @param playgroundId - The unique identifier of the playground to save
 * @param data - The template folder structure containing files and directories
 */

export const saveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder
) => {
  const user = await currentUser();

  if (!user) return null;

  try {
    const updatePlayground = await prisma.templateFile.upsert({
      where: {
        playgroundId,
      },
      update: {
        content: JSON.stringify(data),
      },
      create: {
        playgroundId,
        content: JSON.stringify(data),
        filename: "template",
      },
    });
    return updatePlayground;
  } catch (error) {
    console.error("Error saving playground:", error);
    return null;
  }
};
