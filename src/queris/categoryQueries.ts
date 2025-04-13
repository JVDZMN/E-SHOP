'use server'
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { Category } from "@prisma/client";

const requireAdmin = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You are not logged in");

  const role = user?.privateMetadata?.role;
  if (!role || role !== "ADMIN") throw new Error("You do not have permission");

  return user;
};

export const upsertCategory = async (
  category: Omit<Category, "id"> & { id?: string }
) => {
  try {
    await requireAdmin();

    if (!category) {
      throw new Error("category details needed!!");
    }

    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          ...(category.id ? [{ NOT: [{ id: category.id }] }] : []),
        ],
      },
    });

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "A category with the same name already exists!";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with the same URL already exists!";
      }
      throw new Error(errorMessage);
    }

    const upsertedCategory = category.id
      ? await db.category.update({
          where: { id: category.id },
          data: {
            name: category.name,
            url: category.url,
            image: category.image,
            featured: category.featured,
            updatedAt: category.updatedAt,
          },
        })
      : await db.category.create({
          data: {
            name: category.name,
            url: category.url,
            image: category.image,
            featured: category.featured,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
        });

    return upsertedCategory;
  } catch (error: any) {
    console.error("[UPSERT_CATEGORY]", error?.message);
    throw new Error("Failed to upsert category");
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    await requireAdmin();

    const deletedCategory = await db.category.delete({
      where: { id },
    });

    return deletedCategory;
  } catch (error: any) {
    console.error("[DELETE_CATEGORY_BY_ID]", error?.message);
    throw new Error("Failed to delete category");
  }
};

export const updateCategoryById = async (
  id: string,
  data: Partial<Omit<Category, "id">>
) => {
  try {
    await requireAdmin();

    const updatedCategory = await db.category.update({
      where: { id },
      data,
    });

    return updatedCategory;
  } catch (error: any) {
    console.error("[UPDATE_CATEGORY_BY_ID]", error?.message);
    throw new Error("Failed to update category");
  }
};

export const getAllCategories = async () => {
  try {
    await requireAdmin();

    const categories = await db.category.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        image: true,
        featured: true,
        createdAt: true,
        updatedAt:true
      },
    });

    return categories;
  } catch (error: any) {
    console.error("[GET_CATEGORIES]", error?.message);
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (id: string) => {
  try {
    await requireAdmin();

    const category = await db.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        url: true,
        image: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error: any) {
    console.error("[GET_CATEGORY_BY_ID]", error?.message);
    throw new Error("Failed to fetch category by ID");
  }
};
