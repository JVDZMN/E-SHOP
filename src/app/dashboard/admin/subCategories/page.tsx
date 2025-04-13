// ✅ File: app/dashboard/admin/subCategories/page.tsx

import { getAllSubCategories } from "@/queris/subCategoryQueries";
import { getAllCategories } from "@/queris/categoryQueries";
import ClientSideSubCategoryTable from "@/components/dashboard/tables/subcategory-client-wrapper"; // 👈 New client wrapper
import { Plus } from "lucide-react";
import SubCategoryFormDialog from "@/components/dashboard/forms/subcategory-details";

export default async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();
  const CLOUDINARY_PRESET_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  if (!CLOUDINARY_PRESET_NAME) return null;

  return (
    <ClientSideSubCategoryTable
      subCategories={subCategories}
      categories={categories}
      cloudinaryKey={CLOUDINARY_PRESET_NAME}
    />
  );
}
