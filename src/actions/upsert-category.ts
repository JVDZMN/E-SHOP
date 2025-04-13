"use server";

import { upsertCategory as serverUpsertCategory } from "@/queris/categoryQueries";
import { Category } from "@prisma/client";


type CategoryInput = Omit<Category, "id"> & { id?: string };

export const upsertCategory = async (category: CategoryInput) => {
  return await serverUpsertCategory(category);
};

