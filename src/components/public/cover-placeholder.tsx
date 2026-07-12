import { cn } from "@/lib/utils";

/** Tasteful fallback for case studies without a cover image yet. */
export function CoverPlaceholder({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg border bg-muted",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="font-heading text-[8rem] leading-none text-foreground/[0.08] select-none"
      >
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
