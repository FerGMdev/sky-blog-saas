"use client";

type SubmitButtonsProps = {
  text: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
};

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButtons({
  text,
  className,
  variant,
}: SubmitButtonsProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button
          type="submit"
          disabled
          className={cn("w-fit", className)}
          variant={variant}
        >
          <Loader2 className="size-4 mr-2 animate-spin" />
          Please wait...
        </Button>
      ) : (
        <Button
          type="submit"
          className={cn("w-fit", className)}
          variant={variant}
        >
          {text}
        </Button>
      )}
    </>
  );
}
