"use client";

import { UploadDropzone } from "@/app/utils/UploadThingComponents";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import SubmitButtons from "../SubmitButtons";
import { toast } from "sonner";
import { updateSiteImageAction } from "@/app/actions";

type UploadImageFormProps = {
  siteId: string;
};

export function UploadImageForm({ siteId }: UploadImageFormProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          Upload an image to use as your site logo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded Image"
            width={200}
            height={200}
            className="rounded-md size-[200px]"
          />
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageUrl(res[0].url);
              toast.success("Image has been uploaded successfully");
            }}
            onUploadError={() => {
              toast.error("ERROR! Something went wrong");
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <form action={updateSiteImageAction}>
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <SubmitButtons text="Change Image" />
        </form>
      </CardFooter>
    </Card>
  );
}
