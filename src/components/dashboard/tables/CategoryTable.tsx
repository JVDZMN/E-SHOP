// ✅ File: components/dashboard/tables/category-table.tsx

import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@prisma/client";

interface CategoryTableProps {
  heading?: string;
  subheading?: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  filterValue: keyof Category;
  searchPlaceholder: string;
  columns: ColumnDef<Category>[];
  data: Category[];
  serverPagination?: boolean;
  enableFilterDropdown?: boolean;
}

export default function CategoryTable(props: CategoryTableProps) {
  return <DataTable<Category, any> {...props} />;
}
