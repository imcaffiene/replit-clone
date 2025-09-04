/**
 * Playground data interface
 * contains metadata about the playground including its id, name and other relevant information
 */

import { TemplateFolder } from "../lib/path-to-json";

interface PlaygroundData {
  id: string;
  name?: string;
  templateFile: Array<{
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
  loadPlayground: (id: string) => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}
