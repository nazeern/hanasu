"use client";

import { useState } from "react";
import IconButton from "@/app/ui/icon-button";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function GrammarAssist({ message }: { message: string }) {
  const [open, setOpen] = useState<boolean>(false);

  if (open) {
    return (
      <div
        onClick={() => setOpen(false)}
        className="self-end bg-blue-300 text-blue-600 italic rounded text-sm px-2 py-2 max-w-80 w-fit"
      >
        <p>{message}</p>
      </div>
    );
  }

  return (
    <IconButton
      text="Grammar Assist"
      icon={SparklesIcon}
      size={4}
      className="self-end text-sm bg-blue-300 px-1 text-blue-600"
      onClick={() => setOpen(true)}
    />
  );
}
