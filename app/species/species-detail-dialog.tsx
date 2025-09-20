"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { User } from "lucide-react";
import Image from "next/image";

// Type for species with author information
type SpeciesWithAuthor = Database["public"]["Tables"]["species"]["Row"] & {
  profiles?: {
    display_name: string;
  };
  created_at?: string;
};

export default function SpeciesDetailDialog({ species }: { species: SpeciesWithAuthor }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{species.scientific_name}</DialogTitle>
          <DialogDescription>Detailed information about this species</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{species.kingdom}</Badge>
            {species.endangered && <Badge variant="destructive">Endangered</Badge>}
          </div>

          {/* Image */}
          {species.image && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
            </div>
          )}

          {/* Species Information */}
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scientific Name</h3>
              <p className="text-gray-700">{species.scientific_name}</p>
            </div>

            {species.common_name && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Common Name</h3>
                <p className="italic text-gray-700">{species.common_name}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Kingdom</h3>
              <p className="text-gray-700">{species.kingdom}</p>
            </div>

            {species.total_population && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Population</h3>
                <p className="text-gray-700">{species.total_population.toLocaleString()}</p>
              </div>
            )}

            {species.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="leading-relaxed text-gray-700">{species.description}</p>
              </div>
            )}
          </div>

          {/* Author Information */}
          <div className="border-t pt-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contribution Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Added by <span className="font-medium">{species.profiles?.display_name ?? "Unknown Author"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
