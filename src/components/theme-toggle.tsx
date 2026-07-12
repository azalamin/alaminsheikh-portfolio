"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // `theme` is undefined on the server and on the client's first render,
  // until next-themes resolves it — use that as the mount signal instead
  // of a separate effect, so this never causes a hydration mismatch.
  if (theme === undefined) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        aria-hidden="true"
        className="text-muted-foreground"
      >
        <Monitor />
      </Button>
    );
  }

  const current = options.find((option) => option.value === theme) ?? options[2];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <CurrentIcon />
            <span className="sr-only">Toggle theme ({current.label})</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
            <option.icon />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
