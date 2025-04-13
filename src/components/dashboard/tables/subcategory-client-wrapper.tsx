'use client';

import { SubCategory, Category } from "@prisma/client";
import { Plus } from "lucide-react";
import SubCategoryTable from "./subcategory-table";
import SubCategoryFormDialog from "../forms/subcategory-details";
import { columns } from "./SubCategoryColumns";

interface Props {
  subCategories: (SubCategory & { Category?: { name: string } })[];
  categories: Category[];
  cloudinaryKey: string;
}

export default function ClientSideSubCategoryTable({
  subCategories,
  categories,
  cloudinaryKey,
}: Props) {
  return (
    <SubCategoryTable
      heading="Subcategories"
      subheading="Manage all product subcategories"
      actionButtonText={
        <>
          <Plus size={15} /> Create Subcategory
        </>
      }
      modalChildren={
        <SubCategoryFormDialog cloudinaryKey={cloudinaryKey} categories={categories} />
      }
      newTabLink="/dashboard/admin/subcategories/new"
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subcategory name..."
      columns={columns(categories)} // ✅ safe to call on client now
      serverPagination
      enableFilterDropdown
    />
  );
}
