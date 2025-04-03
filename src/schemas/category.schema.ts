import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[A-Za-z0-9\s\-]+$/, "Name can only contain letters, numbers, spaces, and dashes"),

  image: z
    .string()
    .url("Image must be a valid URL")
    .regex(/\.(jpg|jpeg|png|webp|svg)$/i, "Image URL must end with .jpg, .png, .svg, etc."),

  url: z
    .string()
    .min(3, "URL slug must be at least 3 characters")
    .max(100, "URL slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "URL must be lowercase, alphanumeric, and may include hyphens (no spaces)"
    ),

  featured: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
