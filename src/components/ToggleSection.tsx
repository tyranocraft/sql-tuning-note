"use client";

import { useState } from "react";

export default function ToggleSection({
  showLabel,
  hideLabel,
  buttonClassName,
  className,
  children,
}: {
  showLabel: string;
  hideLabel: string;
  buttonClassName: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className={`text-sm font-medium ${buttonClassName}`}
      >
        {open ? hideLabel : showLabel}
      </button>
      {open && (
        <div className="mt-3 prose prose-sm max-w-none">{children}</div>
      )}
    </div>
  );
}
