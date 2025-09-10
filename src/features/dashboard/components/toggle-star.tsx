"use client";

/**
 * MarkedToggleButton Component - Bookmark/Star toggle for projects
 * 
 * Features:
 * - forwardRef implementation for external button access
 * - Optimistic UI updates with server synchronization
 * - Toast notifications for user feedback
 * - Error handling with state rollback
 * - Proper TypeScript typing with component prop inheritance
 * 
 * Architecture:
 * - Uses React.forwardRef for ref forwarding
 * - Maintains local state synchronized with props
 * - Calls server action for persistent updates
 * - Provides visual feedback with icons and toast messages
 */
import { Button } from "@/components/ui/button";
import { StarIcon, StarOffIcon } from "lucide-react";
import type React from "react";
import { useState, useEffect, forwardRef } from "react";
import { toast } from "sonner";
import { toggleFavorite } from "../server";

/**
 * Props interface extending Button component props
 * - markedForRevision: Initial bookmark state from server
 * - id: Playground ID for server operations
 */
interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  markedForRevision: boolean;
  id: string;
}

/**
 * MarkedToggleButton - Forwardable bookmark toggle component
 * 
 * Uses forwardRef to allow parent components to access the underlying button element
 * Maintains internal state synchronized with server-provided initial state
 * Provides optimistic updates with rollback on failure
 * 
 * @param markedForRevision - Initial bookmark state
 * @param id - Playground identifier
 * @param onClick - Optional parent click handler
 * @param className - Additional CSS classes
 * @param children - Optional custom button content
 * @param props - Additional button props
 * @param ref - Forwarded ref to button element
 */
export const MarkedToggleButton = forwardRef<HTMLButtonElement, MarkedToggleButtonProps>(
  ({ markedForRevision, id, onClick, className, children, ...props }, ref) => {

    /**
     * Internal bookmark state
     * - Synchronized with markedForRevision prop changes
     * - Updated optimistically on user interaction
     * - Rolled back on server operation failure
     */
    const [isMarked, setIsMarked] = useState(markedForRevision);

    /**
     * Synchronize internal state with prop changes
     * - Handles external state updates (e.g., from server refresh)
     * - Ensures component stays in sync with parent data
     */
    useEffect(() => {
      setIsMarked(markedForRevision);
    }, [markedForRevision]);

    /**
     * Handle bookmark toggle with optimistic updates
     * 
     * Flow:
     * 1. Call parent onClick handler if provided
     * 2. Optimistically update UI state
     * 3. Call server action to persist change
     * 4. Show success/error feedback via toast
     * 5. Rollback state if server operation fails
     */
    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Call parent onClick handler if provided (for DropdownMenuItem compatibility)
      onClick?.(event);

      // Optimistic UI update
      const newMarkedState = !isMarked;
      setIsMarked(newMarkedState);

      try {
        // Call server action to persist bookmark state
        const res = await toggleFavorite(id,);
        const { success, error, isMarked: serverMarked } = res;

        if (success && !error) {
          // Use server response to determine actual state and message
          toast.success(
            serverMarked
              ? "Added to Favorites successfully"
              : "Removed from Favorites successfully"
          );
          // Update local state to match server response (in case of discrepancy)
          setIsMarked(serverMarked);
        } else {
          // Handle server-reported errors
          toast.error(error || "Failed to update favorite status");
          // Rollback optimistic update on failure
          setIsMarked(!newMarkedState);
        }
      } catch (error) {
        // Handle network or unexpected errors
        console.error("Failed to toggle bookmark:", error);
        toast.error("Network error. Please try again.");
        // Rollback optimistic update on network failure
        setIsMarked(!newMarkedState);
      }
    };

    return (
      <Button
        ref={ref} // Forward ref to underlying button element
        variant="ghost"
        className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer ${className || ''}`}
        onClick={handleToggle}
        {...props} // Spread additional button props
      >
        {/**
         * Icon display based on current bookmark state
         * - StarIcon (filled, red) for bookmarked items
         * - StarOffIcon (outline, gray) for non-bookmarked items
         */}
        {isMarked ? (
          <StarIcon size={16} className="text-red-500 mr-2" />
        ) : (
          <StarOffIcon size={16} className="text-gray-500 mr-2" />
        )}

        {/**
         * Button text content
         * - Uses provided children if available
         * - Falls back to contextual text based on bookmark state
         */}
        {children || (isMarked ? "Remove Favorite" : "Add to Favorite")}
      </Button>
    );
  }
);

// Set display name for better debugging and React DevTools
MarkedToggleButton.displayName = "MarkedToggleButton";
