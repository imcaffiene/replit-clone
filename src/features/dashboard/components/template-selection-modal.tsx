"use client";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";
import Image from "next/image";
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
    template: "REACTJS" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => void;
};

/**
 * Interface defining the structure of each template option
 * - id: Unique identifier for selection logic
 * - name: Human-readable display name
 * - description: Detailed explanation for users
 * - icon: File path to template icon in /public directory
 * - color: Hex color code for template branding
 * - popularity: Rating from 1-5 for star display
 * - tags: Array of keywords for search functionality
 * - features: Key features to highlight in the UI
 * - category: Classification for filtering
 */
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


const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {

  /**
   * Multi-step wizard state
   * - "select": Step 1 - Template selection with search and filters
   * - "configure": Step 2 - Project configuration with name input
   */
  const [step, setStep] = useState<"select" | "configure">("select");

  /**
   * Currently selected template identifier
   * - null: no selection (initial state)
   * - string: template id (e.g., "reactjs", "nextjs")
   */
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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

  /**
   * User-entered project name for step 2
   * - Empty string: use default name (initial state)
   * - String: custom project name entered by user
   */
  const [projectName, setProjectName] = useState("");

  /**
   * Filtered templates based on current search and category filters
   * Combines search functionality with category filtering
   * Updates automatically when searchQuery or category changes
   */
  const filteredTemplates = templates.filter((template) => {
    /**
     * Search functionality - checks multiple fields for user's query
     * - template.name: Search in template name
     * - template.description: Search in description
     * - template.tags: Search in any of the tags array
     */
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    /**
     * Category filter logic
     * - "all": matches everything
     * - specific category: exact match with template.category
     */
    const matchesCategory = category === "all" || template.category === category;

    return matchesSearch && matchesCategory;
  });

  /**
   * Handles template selection from the radio group
   * Updates selectedTemplate state to trigger visual feedback
   * 
   * @param templateId - The id of the selected template
   */
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  /**
   * Advances from step 1 (select) to step 2 (configure)
   * Only executes when a template is selected
   * Button is disabled when no template is selected
   */
  const handleContinue = () => {
    if (selectedTemplate) {
      setStep("configure");
    }
  };

  /**
   * Handles final project creation and form submission
   * - Validates selectedTemplate exists
   * - Maps internal template IDs to database enum values
   * - Calls parent onSubmit callback with formatted data
   * - Resets modal state and closes modal
   */
  const handleCreateProject = () => {
    if (selectedTemplate) {
      /**
       * Template ID mapping to database enum values
       * Maps internal IDs to match Prisma schema enum
       */
      const templateMap: Record<string, "REACTJS" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR"> = {
        reactjs: "REACTJS",
        nextjs: "NEXTJS",
        express: "EXPRESS",
        vue: "VUE",
        hono: "HONO",
        angular: "ANGULAR",
      };

      const template = templates.find((t) => t.id === selectedTemplate);

      /**
       * Submit formatted data to parent component
       * - title: custom name or generated default
       * - template: mapped database enum value
       * - description: optional template description
       */
      onSubmit({
        title: projectName || `New ${template?.name} Project`,
        template: templateMap[selectedTemplate] || "REACTJS",
        description: template?.description,
      });

      console.log(`Creating ${projectName || "new project"} with template: ${template?.name}`);

      /**
       * Cleanup: Reset all state and close modal
       * Ensures clean state for next modal opening
       */
      onClose();
      setStep("select");
      setSelectedTemplate(null);
      setProjectName("");
    }
  };

  /**
   * Handles back navigation from step 2 to step 1
   * Preserves selected template for better user experience
   */
  const handleBack = () => {
    setStep("select");
  };

  /**
   * Renders star rating display for template popularity
   * Creates array of 5 stars, fills based on count parameter
   * 
   * @param count - Number of stars to fill (1-5)
   * @returns Array of Star components with appropriate styling
   */
  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  return (
    /**
     * shadcn/ui Dialog component with modal functionality
     * - open: Controls visibility from parent component
     * - onOpenChange: Handles close events and state cleanup
     */
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          /**
           * Reset all internal state to initial values
           * Ensures clean state for next modal opening
           */
          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
          setSearchQuery("");
          setCategory("all");
        }
      }}
    >
      {/**
       * Modal content with responsive sizing and scrolling
       * - sm:max-w-[800px]: Wide modal on desktop
       * - max-h-[90vh]: Prevent modal from exceeding viewport
       * - overflow-y-auto: Enable scrolling for tall content
       */}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">

        {/**
         * Conditional rendering based on current wizard step
         * Step 1: Template selection with search/filters
         * Step 2: Project configuration with name input
         */}
        {step === "select" ? (
          <>
            {/**
             * STEP 1: TEMPLATE SELECTION
             * Modal header with title and description
             */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
                <Plus size={24} className="text-[#e93f3f]" />
                Select a Template
              </DialogTitle>

              <DialogDescription>
                Choose a template to create your new playground
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">

              {/**
               * SEARCH AND FILTER CONTROLS
               * Responsive layout: stacked on mobile, side-by-side on desktop
               */}
              <div className="flex flex-col sm:flex-row gap-4">

                {/**
                 * Search input with icon
                 * - relative: Position context for absolute icon
                 * - flex-1: Take remaining space
                 */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
                    size={18}
                  />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/**
                 * Category filter tabs
                 * - Responsive width: full on mobile, auto on desktop
                 * - Grid layout for equal spacing
                 */}
                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setCategory(value as any)}
                >
                  <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/**
               * TEMPLATE SELECTION GRID
               * RadioGroup for accessible single selection
               */}
              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={handleSelectTemplate}
              >
                {/**
                 * Responsive grid layout
                 * - 1 column on mobile for readability
                 * - 2 columns on desktop for space efficiency
                 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative flex p-6 border rounded-lg cursor-pointer
                          transition-all duration-300 hover:scale-[1.02]
                          ${selectedTemplate === template.id
                            ? "border-[#E93F3F] shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)]"
                            : "hover:border-[#E93F3F] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                          }`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        {/**
                         * Star rating display in top right corner
                         * Shows template popularity (1-5 stars)
                         */}
                        <div className="absolute top-4 right-4 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        {/**
                         * Selected state indicator in top left
                         * Only shown when template is selected
                         */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 left-2 bg-[#E93F3F] text-white rounded-full p-1">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/**
                           * Template icon with branded background
                           * Uses template color with 15% opacity
                           */}
                          <div
                            className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: `${template.color}15` }}
                          >
                            <Image
                              src={template.icon || "/placeholder.svg"}
                              alt={`${template.name} icon`}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>

                          {/**
                           * Template information section
                           * - Name with category icon
                           * - Description text
                           * - Tags for additional context
                           */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {template.name}
                              </h3>
                              {/**
                               * Category indicator icons
                               * Different colors for visual distinction
                               */}
                              <div className="flex gap-1">
                                {template.category === "frontend" && (
                                  <Code size={14} className="text-blue-500" />
                                )}
                                {template.category === "backend" && (
                                  <Server size={14} className="text-green-500" />
                                )}
                                {template.category === "fullstack" && (
                                  <Globe size={14} className="text-purple-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>
                            {/**
                             * Template tags display
                             * Pill-shaped design for modern look
                             */}
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 border rounded-2xl"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/**
                         * Hidden radio button for accessibility
                         * Screen readers can still interact with selection
                         */}
                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </div>
                    ))
                  ) : (
                    /**
                     * Empty state when no templates match filters
                     * Provides helpful guidance to user
                     */
                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                      <Search size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">No templates found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/**
             * STEP 1 FOOTER
             * Left side: Setup time estimate
             * Right side: Action buttons
             */}
            <div className="flex justify-between gap-3 mt-4 pt-4 border-t">

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />

                <span>
                  Estimated setup time:{" "}
                  {selectedTemplate ? "2-5 minutes" : "Select a template"}
                </span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  className="bg-[#E93F3F] hover:bg-[#d03636]"
                  disabled={!selectedTemplate}
                  onClick={handleContinue}
                >
                  Continue <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/**
             * STEP 2: PROJECT CONFIGURATION
             * Header shows selected template context
             */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#e93f3f]">
                Configure Your Project
              </DialogTitle>

              <DialogDescription>
                {templates.find((t) => t.id === selectedTemplate)?.name} project
                configuration
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">

              {/**
               * Project name input field
               * - Accessible with proper label association
               * - Controlled input with state management
               */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              {/**
               * Selected template features display
               * - Highlighted box with brand colors
               * - Grid layout for organized display
               */}
              <div className="p-4 shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)] rounded-lg border">
                <h3 className="font-medium mb-2">Selected Template Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap size={14} className="text-[#E93F3F]" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/**
             * STEP 2 FOOTER
             * Back button to return to template selection
             * Create Project button for final submission
             */}
            <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                className="bg-[#E93F3F] hover:bg-[#d03636]"
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
