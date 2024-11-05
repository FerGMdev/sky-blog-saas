"use client";

import { createSiteAction } from "@/app/actions";
import SubmitButtons from "@/app/components/dashboard/SubmitButtons";
import { createSiteSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";

export default function NewSitePage() {
  const [lastResult, action] = useFormState(createSiteAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createSiteSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Card className="max-w-[600px]">
        <CardHeader>
          <CardTitle>Create a new site</CardTitle>
          <CardDescription>
            Create a new site here. Click the button below once you have
            finished.
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent>
            <div className="grid w-full max-w-xl items-center gap-y-6">
              <div className="grid gap-2">
                <Label>Site Name</Label>
                <Input
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.value}
                  placeholder="Name of your site here..."
                />
                <p className="text-red-500 text-sm">{fields.name.errors}</p>
              </div>

              <div className="grid gap-2">
                <Label>Subdirectory</Label>
                <Input
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.value}
                  placeholder="Specify a subdirectory for your site here..."
                />
                <p className="text-red-500 text-sm">
                  {fields.subdirectory.errors}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.value}
                  placeholder="Small description of your site here..."
                />
                <p className="text-red-500 text-sm">
                  {fields.description.errors}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButtons text="Create Site" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
