/**
 * Playground data interface
 * contains metadata about the playground including its id, name and other relevant information
 */

import { useCallback, useEffect, useState } from "react";
import { TemplateFolder } from "../lib/path-to-json";
import { getplaygroundbyId, saveUpdatedCode } from "../server";
import { toast } from "sonner";

interface PlaygroundData {
  id: string;
  name?: string;
  templateFiles: Array<{
    content: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Return type for the usePlayground hook
 * Provides playground state and operations
 */

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

/**
 * Custom hook for managing playground data and template files
 *
 * This hook handles:
 * - Loading playground metadata and template data
 * - Parsing saved content vs fetching from API
 * - Saving updated template data
 * - Loading states and error handling
 * - Toast notifications for user feedback
 *
 * @param id - The playground ID to manage
 * @returns Object containing playground data, loading state, and operations
 */

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
    null
  );
  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Error message state
   * Stores any error messages from failed operations
   */
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // DATA LOADING OPERATIONS
  // ============================================

  /**
   * Loads playground data with fallback strategy
   *
   * Loading Strategy:
   * 1. First, try to load saved content from playground files
   * 2. If no saved content or parsing fails, fetch from template API
   * 3. Normalize the data structure for consistent usage
   *
   * Error Handling:
   * - Parsing errors for saved content are logged but don't fail the operation
   * - Network errors and API failures are caught and displayed to user
   * - Loading state is always reset regardless of success/failure
   */

  const loadPlayground = useCallback(async () => {
    if (!id) {
      console.warn("No playground ID provided, aborting load");
      return;
    }

    try {
      // reset the error state and show loading
      setIsLoading(true);
      setError(null);

      // fetch the playground metadata from database
      const data = await getplaygroundbyId(id);

      const rawContent = data?.templateFiles?.[0]?.content;
      if (typeof rawContent === "string") {
        try {
          const parseContent = JSON.parse(rawContent);

          // Successfully parsed saved content
          setPlaygroundData(data);
          setTemplateData(parseContent);
          toast.success("Playground loaded successfully");
          return;
        } catch (parseError) {
          console.warn(
            "Failed to parse saved content, falling back to API:",
            parseError
          );
        }
      }

      // Fetch template data from API as fallback
      const response = await fetch(`/api/template/${id}`);

      if (!response.ok) {
        throw new Error(
          `Failed to load template: ${response.status} ${response.statusText}`
        );
      }

      const templateResponse = await response.json();

      //Normalize the template data structure
      if (
        templateResponse.templateJson &&
        Array.isArray(templateResponse.templateJson)
      ) {
        setTemplateData({
          folderName: "Project",
          items: templateResponse.templateJson,
        });
      } else {
        setTemplateData(
          templateResponse.templateJson || {
            folderName: "Project",
            items: [],
          }
        );
      }

      //store playground metadata
      setPlaygroundData(data);
      toast.success("Playground loaded successfully");
    } catch (error) {
      console.error("Error loading playground:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to load playground";

      setError(errorMessage);
      toast.error("Failed to load playground");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // ============================================
  // DATA PERSISTENCE OPERATIONS
  // ============================================

  /**
   * Saves updated template data to the backend
   *
   * This function:
   * - Calls the SaveUpdatedCode server action
   * - Updates local state optimistically
   * - Provides user feedback via toast notifications
   * - Throws errors for caller to handle if needed
   *
   * @param data - The updated template folder structure to save
   * @returns Promise that resolves with saved data or void
   * @throws Re-throws any errors from the save operation
   */
  const saveTemplateData = useCallback(
    async (data: TemplateFolder): Promise<void> => {
      if (!id) {
        toast.error("No playground ID available for saving");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        await saveUpdatedCode(id, data);
        setTemplateData(data);
        toast.success("Changes saved successfully");
      } catch (error) {
        console.error("Error saving template data:", error);

        toast.error("Failed to save changes");

        // Re-throw error so caller can handle it (e.g., for rollback)
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (id) {
      loadPlayground();
    }
  }, [id, loadPlayground]);

  return {
    playgroundData,
    isLoading,
    error,
    templateData,
    loadPlayground,
    saveTemplateData,
  };
};
