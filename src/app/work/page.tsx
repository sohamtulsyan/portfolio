import type { Metadata } from "next";
import { WorkTimeline } from "@/components/sections/WorkTimeline";
import { PageHeader } from "@/components/ui/primitives";
import { getWork } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <PageHeader title="Work" lead="Where I've worked, what I owned, and what shipped." />
      <div className="container-page mt-14 max-w-4xl">
        <WorkTimeline work={getWork()} />
      </div>
    </>
  );
}
