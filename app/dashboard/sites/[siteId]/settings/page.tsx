import { deleteSiteAction } from "@/app/actions";
import { UploadImageForm } from "@/app/components/dashboard/forms/UploadImageForm";
import SubmitButtons from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsSitePage({
  params,
}: {
  params: { siteId: string };
}) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-lg font-semibold">Go Back</h3>
      </div>

      {/* Settings Form */}

      <UploadImageForm siteId={params.siteId} />

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            This will delete your site and all of your articles associated with
            it. If you are sure you want to delete your site, please click the
            button below.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={deleteSiteAction}>
            {/* Hidden input to pass the siteId to the action */}
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButtons text="Delete Site" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
