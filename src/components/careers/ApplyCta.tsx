"use client";

import { useState } from "react";
import { Button } from "@/components/site/primitives";
import { ArrowRight } from "@/components/site/icons";
import ApplyModal from "@/components/careers/ApplyModal";

export default function ApplyCta({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-16 rounded-2xl border border-hairline bg-elevated/60 p-8 text-center">
      <h3 className="text-xl font-semibold tracking-tight">Interested in the {title} role?</h3>
      <p className="mx-auto mt-3 max-w-md text-fg-muted">
        Attach your resume and share a few details. We read every application personally.
      </p>
      <div className="mt-6 flex justify-center">
        <Button size="md" iconRight={<ArrowRight size={16} />} onClick={() => setOpen(true)}>
          Apply now
        </Button>
      </div>
      <ApplyModal isOpen={open} onClose={() => setOpen(false)} role={title} />
    </div>
  );
}
