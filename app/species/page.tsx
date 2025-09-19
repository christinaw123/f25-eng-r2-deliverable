import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import type { Database } from "@/lib/schema";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";
type SpeciesRow = Database["public"]["Tables"]["species"]["Row"];
type Author = { display_name: string };
type RawSpecies = SpeciesRow & { profiles?: Author | Author[] };
type SpeciesWithAuthor = SpeciesRow & { profiles?: Author };

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  const { data: species } = await supabase
    .from("species")
    .select(
      `
    *,
    profiles:author (
      display_name
    )
  `,
    )
    .order("id", { ascending: false })
    .returns<RawSpecies[]>();

  type SpeciesWithAuthor = Database["public"]["Tables"]["species"]["Row"] & {
    profiles?: { display_name: string };
  };

  // Normalize profiles to a single object (no `any`, no unsafe member access)
  const normalized: SpeciesWithAuthor[] = (species ?? []).map((s) => {
    const p = (s as any).profiles;
    return {
      ...s,
      profiles: Array.isArray(p) ? p[0] : p, // force a single object
    } as SpeciesWithAuthor;
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {normalized?.map((speciesItem) => (
          <SpeciesCard key={speciesItem.id} species={speciesItem} sessionId={sessionId} />
        ))}
      </div>
    </>
  );
}
