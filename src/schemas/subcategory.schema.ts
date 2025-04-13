import { z } from "zod"

// SubCategory form schema
export const subCategorySchema = z.object({
  name: z
    .string({
      required_error: "Subcategory name is required.",
      invalid_type_error: "Subcategory name must be a string.",
    })
    .min(2, { message: "Subcategory name must be at least 2 characters long." })
    .max(50, { message: "Subcategory name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s'&-]+$/, {
      message: "Only letters, numbers, and spaces are allowed in the subcategory name.",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose a subcategory image."),
  url: z
    .string({
      required_error: "Subcategory URL is required.",
      invalid_type_error: "Subcategory URL must be a string.",
    })
    .min(2, { message: "Subcategory URL must be at least 2 characters long." })
    .max(50, { message: "Subcategory URL cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message: "Only letters, numbers, hyphen, and underscore are allowed in the subcategory URL.",
    }),
  featured: z.boolean(),
  categoryId: z
    .string()
    .min(1, { message: "Category ID is required." }),
})

export type SubCategoryFormValues = z.infer<typeof subCategorySchema>
