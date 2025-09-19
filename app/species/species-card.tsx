"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { Trash2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog";
import SpeciesDetailDialog from "./species-detail-dialog";

// type for species with author information
type SpeciesWithAuthor = Database["public"]["Tables"]["species"]["Row"] & {
  profiles?: {
    display_name: string;
    email: string;
  };
};

export default function SpeciesCard({ species, sessionId }: { species: SpeciesWithAuthor; sessionId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAuthor = species.author === sessionId;

  const handleDelete = async () => {
    if (!isAuthor) return;

    setIsDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("species").delete().eq("id", species.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete species. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setShowDeleteDialog(false);
      router.refresh(); // Refresh the page to update the species list

      toast({
        title: "Species deleted",
        description: `Successfully deleted ${species.scientific_name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete species. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}

      {/* Header with title and delete button */}
      <div className="mt-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{species.scientific_name}</h3>
          <h4 className="text-lg font-light italic">{species.common_name}</h4>
        </div>

        {isAuthor && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Species</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{species.scientific_name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Endangered badge */}
      {species.endangered && (
        <Badge variant="destructive" className="mt-2 w-fit">
          Endangered
        </Badge>
      )}

      {/* Description */}
      <p className="mt-2">{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      {/* Author Information */}
      <div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>
          Added by {species.profiles?.display_name || "Unknown Author"}
          {isAuthor && " (You)"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 space-y-2">
        <SpeciesDetailDialog species={species} />
        {isAuthor && <EditSpeciesDialog species={species} />}
      </div>
    </div>
  );
}
