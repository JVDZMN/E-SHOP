// ✅ File: components/ui/data-table.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, Search } from "lucide-react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useModal } from "@/components/providers/modal-provides";
import CustomModal from "../dashboard/shared/custom-modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  searchPlaceholder: string;
  heading?: string;
  subheading?: string;
  noHeader?: true;
  serverPagination?: boolean;
  enableFilterDropdown?: boolean;
}

export default function DataTable<TData extends { url?: string }, TValue>({
  columns,
  data,
  filterValue,
  modalChildren,
  actionButtonText,
  searchPlaceholder,
  heading,
  subheading,
  noHeader,
  newTabLink,
  serverPagination,
  enableFilterDropdown,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useModal();
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(() => Number(localStorage.getItem("pageIndex")) || 0);
  const [pageSize, setPageSize] = useState(() => Number(localStorage.getItem("pageSize")) || 10);
  const [pageInput, setPageInput] = useState(1);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const filteredData = showOnlyFeatured ? data.filter((item: any) => item.featured) : data;
  const paginatedData = filteredData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  const pageCount = Math.ceil(filteredData.length / pageSize);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
    },
  });

  useEffect(() => {
    localStorage.setItem("pageIndex", pageIndex.toString());
    localStorage.setItem("pageSize", pageSize.toString());
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex > 0 && pageIndex >= table.getPageCount()) {
      setPageIndex(0);
    }
  }, [pageSize, filteredData.length]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 flex-wrap">
        <div className="flex flex-wrap gap-2 items-center">
          <Search />
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(filterValue)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(filterValue)?.setFilterValue(event.target.value)}
            className="h-12 w-full sm:w-auto"
          />
          {enableFilterDropdown && (
            <Button
              variant={showOnlyFeatured ? "default" : "outline"}
              onClick={() => setShowOnlyFeatured((prev) => !prev)}
            >
              ⭐ {showOnlyFeatured ? "Showing Featured" : "All Categories"}
            </Button>
          )}
        </div>

        <div className="flex gap-x-2 flex-wrap">
          {modalChildren && (
            <Button
              className="flex gap-2"
              onClick={() =>
                setOpen(
                  <CustomModal heading={heading || ""} subheading={subheading || ""}>
                    {modalChildren}
                  </CustomModal>
                )
              }
            >
              {actionButtonText}
            </Button>
          )}
          {newTabLink && (
            <Link href={newTabLink} passHref legacyBehavior>
              <Button asChild variant="outline">
                <a>
                  <FilePlus2 className="me-1" /> Create in new page
                </a>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border bg-background">
        <Table className="w-full">
          {!noHeader && (
            <TableHeader className="hidden md:table-header-group">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer"
                      onClick={header.column.getToggleSortingHandler?.()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼") : ""}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition cursor-pointer"
                  onClick={() => row.original.url && router.push(`/dashboard/admin/categories/${row.original.url}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="max-w-[400px] break-words">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No Results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>

          <div className="flex items-center gap-1">
            <span>Go to page:</span>
            <input
              type="number"
              min={1}
              max={pageCount}
              value={pageInput}
              onChange={(e) => setPageInput(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const page = Number(pageInput);
                  if (page >= 1 && page <= pageCount) setPageIndex(page - 1);
                }
              }}
              className="w-16 border rounded px-1 py-0.5"
            />
          </div>

          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}