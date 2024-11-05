"use client";

import { createPostAction } from "@/app/actions";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { UploadDropzone } from "@/app/utils/UploadThingComponents";
import { PostSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ArrowLeft, Atom } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSONContent } from "novel";
import { useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import slugify from "react-slugify";
import SubmitButtons from "@/app/components/dashboard/SubmitButtons";

export default function CreateArticlePage({
  params,
}: {
  params: { siteId: string };
}) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // State for the cover image
  const [value, setValue] = useState<JSONContent | undefined>(undefined); // State for the article content
  const [title, setTitle] = useState<string | undefined>(undefined); // State for the title
  const [slug, setSlug] = useState<string | undefined>(undefined); // State for the slug
  const [lastResult, action] = useFormState(createPostAction, undefined); // State for the action result
  // This is used to validate the form data when the user is typing
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleGenerateSlug() {
    const titleInput = title;

    // Check if the title is empty or undefined
    if (titleInput?.length === 0 || titleInput === undefined) {
      return toast.error("Please enter a title first");
    }

    const slugText = slugify(titleInput);
    setSlug(slugText);

    return toast.success("Slug generated successfully");
  }
  return (
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Here you can create a new article for your blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
          >
            <input type="hidden" name="siteId" value={params.siteId} />
            {/*-------------------------- Title --------------------------*/}
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                placeholder="Nextjs blogging application"
                key={fields.title.key}
                name={fields.title.name}
                defaultValue={fields.title.initialValue}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <p className="text-sm text-red-500">{fields.title.errors}</p>
            </div>

            {/*-------------------------- Slug --------------------------*/}
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                placeholder="Article Slug"
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={fields.slug.initialValue}
                onChange={(e) => setSlug(e.target.value)}
                value={slug}
              />
              <p className="text-sm text-red-500">{fields.slug.errors}</p>
              <Button
                className="w-fit"
                variant="secondary"
                type="button"
                onClick={handleGenerateSlug}
              >
                <Atom className="size-4 mr-2" /> Generate Slug
              </Button>
            </div>

            {/*-------------------------- Small Description --------------------------*/}
            <div className="grid gap-2">
              <Label>Small Description</Label>
              <Textarea
                placeholder="Small Description for your blog article..."
                key={fields.smallDescription.key}
                name={fields.smallDescription.name}
                defaultValue={fields.smallDescription.initialValue}
              />
              <p className="text-sm text-red-500">
                {fields.smallDescription.errors}
              </p>
            </div>

            {/*-------------------------- Cover Image --------------------------*/}
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <input
                type="hidden"
                name={fields.coverImage.name}
                defaultValue={fields.coverImage.initialValue}
                value={imageUrl}
              />

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Cover Image Preview"
                  width={100}
                  height={100}
                  className="object-cover rounded-lg w-[200px] h-[200px]"
                />
              ) : (
                <UploadDropzone
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    toast.success("Image uploaded successfully");
                  }}
                  endpoint="imageUploader"
                  onUploadError={(error: Error) => {
                    toast.error("Something went wrong");
                  }}
                />
              )}
              <p className="text-sm text-red-500">{fields.coverImage.errors}</p>
            </div>

            {/*-------------------------- Article Content --------------------------*/}
            <div className="grid gap-2">
              <Label>Article Content</Label>
              <input
                type="hidden"
                name={fields.articleContent.name}
                key={fields.articleContent.key}
                defaultValue={fields.articleContent.initialValue}
                value={JSON.stringify(value)}
              />
              <TailwindEditor
                onContentChange={setValue}
                initialContent={value}
              />
              <p className="text-sm text-red-500">
                {fields.articleContent.errors}
              </p>
            </div>

            {/*-------------------------- Submit Button --------------------------*/}
            <SubmitButtons text="Create Article" />
          </form>
        </CardContent>
      </Card>
    </>
  );
}
