import { FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

export function EmptyState({
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
        <FileIcon className="size-10 text-primary" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-normal mt-2 max-w-sm">
        {description}
      </p>
      <Button asChild>
        <Link href={href}>
          <PlusCircle className="size-4 mr-2" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
