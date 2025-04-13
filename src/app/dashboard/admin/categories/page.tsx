// ✅ File: app/dashboard/admin/categories/page.tsx

import CategoryDetails from "@/components/dashboard/forms/category-details";
import { getAllCategories } from "@/queris/categoryQueries";
import { Plus } from "lucide-react";
import CategoryTable from "@/components/dashboard/tables/CategoryTable";
import { columns } from "@/components/dashboard/tables/CategoryColumns";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  const CLOUDINARY_PRESET_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  if (!CLOUDINARY_PRESET_NAME) return null;

  return (
    <CategoryTable
      heading="Categories"
      subheading="Manage product categories"
      actionButtonText={
        <>
          <Plus size={15} /> Create Category
        </>
      }
      modalChildren={<CategoryDetails cloudinaryKey={CLOUDINARY_PRESET_NAME} />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
      serverPagination
      enableFilterDropdown
    />
  );
}
