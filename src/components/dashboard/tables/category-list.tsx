'use client'

import { useEffect, useMemo, useState } from "react";
import { getAllCategories } from "@/queris/categoryQueries";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";



const ITEMS_PER_PAGE = 5;

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    url: true,
    image: true,
    featured: true,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, categories]);

  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredCategories]);

  const paginatedCategories = useMemo(() => {
    return sortedCategories.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedCategories, currentPage]);

  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const totalPages = Math.ceil(sortedCategories.length / ITEMS_PER_PAGE);
  if (!categories) return <div className="text-red-600 align-middle justify-center">OOps! no category found</div>;
  else return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Input
          placeholder="Filter by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleColumnVisibility("url")}
        >
          {visibleColumns.url ? <EyeOff size={16} /> : <Eye size={16} />} URL
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggleColumnVisibility("image")}
        >
          {visibleColumns.image ? <EyeOff size={16} /> : <Eye size={16} />} Image
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggleColumnVisibility("featured")}
        >
          {visibleColumns.featured ? <EyeOff size={16} /> : <Eye size={16} />} Featured
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                {visibleColumns.url && <TableHead>URL</TableHead>}
                {visibleColumns.image && <TableHead>Image</TableHead>}
                {visibleColumns.featured && <TableHead>Featured</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(category.id)}
                      onCheckedChange={() => toggleRowSelection(category.id)}
                    />
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  {visibleColumns.url && (
                    <TableCell className="text-muted-foreground">
                      /{category.url}
                    </TableCell>
                  )}
                  {visibleColumns.image && (
                    <TableCell>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                  )}
                  {visibleColumns.featured && (
                    <TableCell>
                      {category.featured ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Button size="icon" variant="outline">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? " pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? " pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </Card>
  );
}
