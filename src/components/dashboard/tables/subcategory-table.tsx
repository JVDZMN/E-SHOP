// ✅ File: components/dashboard/tables/subcategory-table.tsx

import DataTable from "@/components/ui/data-table";
import { SubCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

interface SubCategoryTableProps {
  heading?: string;
  subheading?: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  filterValue: keyof SubCategory;
  searchPlaceholder: string;
  columns: ColumnDef<SubCategory>[];
  data: SubCategory[];
  serverPagination?: boolean;
  enableFilterDropdown?: boolean;
}

export default function SubCategoryTable(props: SubCategoryTableProps) {
  return <DataTable<SubCategory, any> {...props} />;
}
