"use client";

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
import Image from "next/image";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>Detailed information about this species</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
