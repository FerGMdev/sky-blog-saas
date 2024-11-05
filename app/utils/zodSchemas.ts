import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const createSiteSchema = z.object({
  name: z.string().min(1).max(25),
  description: z.string().min(1).max(150),
  subdirectory: z.string().min(1).max(50),
});

export const PostSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(190),
  coverImage: z.string().min(1),
  smallDescription: z.string().min(1).max(200),
  articleContent: z.string().min(1),
});

export function SiteCreationSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    subdirectory: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[a-z]+$/, "Subdirectory must be lowercase letters")
      .transform((value) => value.toLowerCase())
      .pipe(
        z.string().superRefine(async (email, ctx) => {
          // Check if the subdirectory uniqueness check is provided
          if (typeof options?.isSubdirectoryUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          // Check if the subdirectory is unique
          return options.isSubdirectoryUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message:
                  "Subdirectory is already taken. Please choose another one.",
              });
            }
          });
        })
      ),
    name: z.string().min(1).max(25),
    description: z.string().min(1).max(150),
  });
}
