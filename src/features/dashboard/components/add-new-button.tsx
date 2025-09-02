"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import TemplateSelectionModal from "./template-selection-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPlayground } from "../actions";

export const AddNewButton = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // select template data state
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    description?: string;
    template: "REACTJS" | "NEXTJS" | "VUE" | "EXPRESS" | "HONO" | "ANGULAR";
  } | null>(null);

  const router = useRouter();

  /**
    * Handle form submission from template selection modal
    * - Creates playground via server action
    * - Handles success/error states with toast notifications
    * - Navigates to created playground on success
    * 
    * @param data - Project configuration from modal
    */
  const handleSubmit = async (data: {
    title: string;
    template: "REACTJS" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    try {
      setSelectedTemplate(data);

      toast.loading("Creating playground...");

      const res = await createPlayground(data);

      if (res.success && res.playground) {
        toast.dismiss();
        toast.success("Playground created successfully!");
        console.log("Playground created successfully!", res.playground);

        //close modal and navigate to playground
        setIsModalOpen(false);
        router.push(`/playground/${res.playground.id}`);
      } else {
        toast.dismiss();
        toast.error(`Failed to create playground: ${res.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred");
      console.error("Error creating playground:", error);
    }
  };

  return (
    <>
      <div className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
        onClick={() => setIsModalOpen(true)}
      >

        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
            size={"icon"}
          >
            <PlusIcon
              size={30}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">Add New</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Create a new playground</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={'/logo.svg'} // todo - change it to add-new-playground.svg
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>


  );
};