"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

/**
 * Props interface for the modal component
 * - isOpen: Controls modal visibility
 * - onClose: Callback to close modal
 * - onSubmit: Callback with form data when creating project
 */

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    template: "REACTJS" | "NEXTJS" | "VUE" | "EXPRESS" | "HONO" | "ANGULAR";
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}


/**
 * Array of all available project templates
 * Each template contains complete configuration for display and functionality
 * Icons should be stored in /public directory (e.g., /public/react.svg)
 */
const templates: TemplateOption[] = [
  {
    id: "reactjs",
    name: "React",
    description: "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/expressjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description: "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    icon: "/vuejs-icon.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description: "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: ["Dependency Injection", "TypeScript Support", "Modular Architecture"],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description: "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["TypeScript", "Fullstack", "Enterprise"],
    features: ["Reactive Data Binding", "Component System", "Dependency Injection", "TypeScript Support"],
    category: "fullstack",
  },
];


export const TemplateSelectionModal = ({ isOpen, onClose, onSubmit }: TemplateSelectionModalProps) => {

  /**
    * Currently selected template identifier
    * - null: no selection (initial state)
    * - string: template id (e.g., "reactjs", "nextjs")
    */
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  /**
     * Currently selected template identifier
     * - null: no selection (initial state)
     * - string: template id (e.g., "reactjs", "nextjs")
     */
  const [step, setStep] = useState<"select" | "configure">("select");

  /**
     * Search query for filtering templates
     * - Empty string: show all templates (initial state)
     * - String: user's search term for live filtering
     */
  const [searchQuery, setSearchQuery] = useState("");

  /**
    * Category filter for templates
    * - "all": show all categories (initial state)
    * - "frontend"/"backend"/"fullstack": show specific category
    */
  const [category, setCategory] = useState<"all" | "frontend" | "backend" | "fullstack">("all");


  return (
    <Dialog
      open={isOpen}
    >
      <DialogContent>
        {
          step === "select" ?
            (
              <>
                <DialogHeader className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
                    <Plus
                      size={24}
                      className="text-[#e93f3f]"
                    />
                    <span>Select a template</span>
                  </DialogTitle>

                  <DialogDescription>
                    Choose a template to create your new playground
                  </DialogDescription>
                </DialogHeader>


                <div className="flex flex-col gap-6 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
                        size={18}
                      />

                      <Input
                        placeholder="Search"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Tabs
                      defaultValue="all"
                      className="w-full sm:w-auto"
                      onValueChange={(value) => setCategory(value as any)}
                    >
                      <TabsList className="grid grid-cols-4 ">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="frontend">Frontend</TabsTrigger>
                        <TabsTrigger value="backend">Backend</TabsTrigger>
                        <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </>
            ) : (<></>)
        }
      </DialogContent>
    </Dialog>
  );


};