"use server";

import { currentUser } from "@/features/auth/action";
import prisma from "@/lib/db";
import {
  CreatePlayground,
  PlaygroundResult,
  GetPlaygroundsResult,
} from "../types";
import { revalidatePath } from "next/cache";

// In your actions file
export const toggleFavorite = async (
  playgroundId: string
): Promise<{
  success: boolean;
  isMarked: boolean;
  error?: string;
}> => {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      success: false,
      isMarked: false,
      error: "You must be logged in to toggle a playground star",
    };
  }

  try {
    // First get the current state
    const existingMark = await prisma.starmark.findFirst({
      where: {
        userId: user.id,
        playgroundId: playgroundId,
      },
    });

    const currentState = existingMark?.isMarked || false;
    const newState = !currentState;

    // Toggle the state
    if (newState) {
      await prisma.starmark.upsert({
        where: {
          userId_playgroundId: {
            userId: user.id,
            playgroundId: playgroundId,
          },
        },
        update: { isMarked: true },
        create: {
          userId: user.id,
          playgroundId: playgroundId,
          isMarked: true,
        },
      });
    } else {
      await prisma.starmark.deleteMany({
        where: {
          userId: user.id,
          playgroundId: playgroundId,
        },
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      isMarked: newState,
    };
  } catch (error) {
    console.error("Error toggling favorite:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: "Failed to toggle favorite: " + error.message,
        isMarked: false,
      };
    }

    return {
      success: false,
      error: "An unknown error occurred",
      isMarked: false,
    };
  }
};

export const createPlayground = async (
  data: CreatePlayground
): Promise<PlaygroundResult> => {
  const { title, description, template } = data;

  // input validation
  if (!title || title.trim().length === 0) {
    return {
      success: false,
      error: "Title is required",
    };
  }

  if (title.length > 100) {
    return {
      success: false,
      error: "Title must be less than 100 characters",
    };
  }

  // get current user
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      success: false,
      error: "You must be logged in to create a playground",
    };
  }

  try {
    const existingUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {}, // don't update existing user
      create: {
        id: user.id,
        name: user.name || "Anonymous User",
        image: user.image,
        email: user.email || `user-${user.id}@example.com`,
      },
    });

    const playground = await prisma.playground.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        template,
        userId: existingUser.id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      playground,
    };
  } catch (error) {
    console.error("Error creating playground:", error);

    //handle error
    if (error instanceof Error) {
      return {
        success: false,
        error: "Failed to create playground: " + error.message,
      };
    }

    return {
      success: false,
      error: "an unknown error occured",
    };
  }
};

export const getPlaygroundForUser = async (): Promise<GetPlaygroundsResult> => {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      success: false,
      error: "You must be logged in to get your playgrounds",
    };
  }

  try {
    const playgrounds = await prisma.playground.findMany({
      where: {
        userId: user.id, // for current user
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        starmarks: {
          where: {
            userId: user.id, // only current user starred
            isMarked: true, // only starred
          },
          select: {
            isMarked: true, // just get the isMarked field
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const transformationPlaygrounds = playgrounds.map((playgrounds) => ({
      ...playgrounds, //keep all existing playground data
      isBookmarkedByUser: playgrounds.starmarks.length > 0, //check if user starred this playground
      starmarks: undefined, //remove starmarks from playground data
    }));
    return {
      success: true,
      playgrounds: transformationPlaygrounds,
    };
  } catch (error) {
    console.error("Error getting playgrounds:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: "Failed to get playgrounds: " + error.message,
      };
    }
    return {
      success: false,
      error: "Failed to delete playground",
    };
  }
};

// edit project server action

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
): Promise<PlaygroundResult> => {
  try {
    //input validation
    if (!data.title || data.title.trim().length === 0) {
      return {
        success: false,
        error: "Title is required",
      };
    }

    if (data.title.length > 100) {
      return {
        success: false,
        error: "Title must be less than 100 characters",
      };
    }

    //authorization check
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        success: false,
        error: "You must be logged in to edit a playground",
      };
    }

    //verify ownership
    const existingPlayground = await prisma.playground.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPlayground) {
      return {
        success: false,
        error: "You don't have access to edit this playground",
      };
    }

    //update database
    const updatePlayground = await prisma.playground.update({
      where: {
        id,
      },
      data: {
        title: data.title.trim(),
        description: data.description?.trim(),
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      playground: updatePlayground,
    };
  } catch (error) {
    console.error("Error editing playground:", error);

    return {
      success: false,
      error: "Failed to edit playground",
    };
  }
};

// copy of an existing playground
export const duplicateProjectById = async (
  id: string
): Promise<PlaygroundResult> => {
  try {
    // auth check
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        success: false,
        error: "You must be logged in to duplicate a playground",
      };
    }

    /**
     * Two-Phase Operation:
     * 1. Fetch original playground (with ownership check)
     * 2. Create duplicate with modified data
     */

    const originalPlayground = await prisma.playground.findFirst({
      where: {
        id,
        userId: user.id, //// User can only duplicate their own playgrounds
      },
    });

    if (!originalPlayground) {
      return {
        success: false,
        error: "You don't have access to duplicate this playground",
      };
    }

    const duplicatePlayground = await prisma.playground.create({
      data: {
        title: `${originalPlayground.title} (copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      playground: duplicatePlayground,
    };
  } catch (error) {
    console.error("Error duplicating playground:", error);

    return {
      success: false,
      error: "Failed to duplicate playground",
    };
  }
};

export const deleteProjectById = async (
  id: string
): Promise<PlaygroundResult> => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        success: false,
        error: "You must be logged in to delete a playground",
      };
    }

    //verify ownership before deleting
    const playground = await prisma.playground.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!playground) {
      return {
        success: false,
        error: "Playground not found or you don't have permission to delete it",
      };
    }

    await prisma.playground.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting playground:", error);
    return {
      success: false,
      error: "Failed to delete playground",
    };
  }
};
