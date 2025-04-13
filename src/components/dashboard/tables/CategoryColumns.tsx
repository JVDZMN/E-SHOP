
"use client";

import Image from "next/image";
import { BadgeCheck, BadgeMinus, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/providers/modal-provides";
import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import CategoryDetails from "../forms/category-details";
import { toast } from "sonner";
import { deleteCategoryById, getCategoryById } from "@/queris/categoryQueries";

const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || "";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className="relative w-14 h-14 rounded-full overflow-hidden">
        <Image
          src={row.original.image}
          alt={row.original.name}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-extrabold text-lg capitalize">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => <span>/{row.original.url}</span>,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <span className="text-muted-foreground flex justify-center">
        {row.original.featured ? <BadgeCheck className="stroke-green-300" /> : <BadgeMinus />}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

interface CellActionsProps {
  rowData: Category;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategoryById(rowData.id);
      toast.success("Category deleted successfully.");
      setShowConfirm(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category.");
    } finally {
      setLoading(false);
      setClose();
    }
  };

  return (
    <>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={async () => {
                const fullData = await getCategoryById(rowData.id);
                setOpen(
                  <CustomModal heading={`Edit \"${rowData.name}\"`}>
                    <CategoryDetails data={fullData} cloudinaryKey={CLOUDINARY_PRESET} />
                  </CustomModal>
                );
              }}
            >
              <Edit size={15} /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 text-destructive">
                <Trash size={15} /> Delete Category
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category <b>{rowData.name}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
