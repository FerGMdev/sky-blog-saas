"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadDropzone } from "@/app/utils/UploadThingComponents";
import { toast } from "sonner";
import TailwindEditor from "../EditorWrapper";
import SubmitButtons from "../SubmitButtons";
import { JSONContent } from "novel";
import { useState } from "react";
import { useFormState } from "react-dom";
import { updatePostAction } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { PostSchema } from "@/app/utils/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import slugify from "react-slugify";
import { Atom } from "lucide-react";

type EditArticleFormProps = {
  data: {
    title: string;
    slug: string;
    smallDescription: string;
    articleContent: any;
    id: string;
    image: string;
  };
  siteId: string;
};

export function EditArticleForm({ data, siteId }: EditArticleFormProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(data.image); // State for the cover image
  const [value, setValue] = useState<JSONContent | undefined>(
    data.articleContent
  ); // State for the article content
  const [title, setTitle] = useState<string | undefined>(data.title); // State for the title
  const [slug, setSlug] = useState<string | undefined>(data.slug); // State for the slug
  const [lastResult, action] = useFormState(updatePostAction, undefined); // State for the action result
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
    <Card className="mt-4">
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
          <input type="hidden" name="articleId" value={data.id} />
          <input type="hidden" name="siteId" value={siteId} />
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
              defaultValue={data.smallDescription}
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
            <TailwindEditor onContentChange={setValue} initialContent={value} />
            <p className="text-sm text-red-500">
              {fields.articleContent.errors}
            </p>
          </div>

          {/*-------------------------- Submit Button --------------------------*/}
          <SubmitButtons text="Edit Article" />
        </form>
      </CardContent>
    </Card>
  );
}
