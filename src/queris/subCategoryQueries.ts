'use server'

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { SubCategory } from "@prisma/client"

// 🔐 Check if the current user is an admin
const requireAdmin = async () => {
  const user = await currentUser()
  if (!user) throw new Error("You are not logged in")

  const role = user?.privateMetadata?.role
  if (!role || role !== "ADMIN") throw new Error("You do not have permission")

  return user
}

// ➕ Create or ✏️ Update a subcategory
export const upsertSubCategory = async (
  subCategory: Omit<SubCategory, "id"> & { id?: string }
) => {
  try {
    await requireAdmin()

    if (!subCategory) {
      throw new Error("Subcategory details are required.")
    }

    if (!subCategory.categoryId) {
      throw new Error("Please select a category.")
    }

    const existing = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          ...(subCategory.id ? [{ NOT: { id: subCategory.id } }] : []),
        ],
      },
    })

    if (existing) {
      if (existing.name === subCategory.name) {
        throw new Error("A subcategory with this name already exists.")
      }
      if (existing.url === subCategory.url) {
        throw new Error("A subcategory with this URL already exists.")
      }
    }

    const result = subCategory.id
      ? await db.subCategory.update({
          where: { id: subCategory.id },
          data: {
            name: subCategory.name,
            url: subCategory.url,
            image: subCategory.image,
            featured: subCategory.featured,
            categoryId: subCategory.categoryId,
            updatedAt: subCategory.updatedAt,
          },
        })
      : await db.subCategory.create({
          data: {
            name: subCategory.name,
            url: subCategory.url,
            image: subCategory.image,
            featured: subCategory.featured,
            categoryId: subCategory.categoryId,
            createdAt: subCategory.createdAt,
            updatedAt: subCategory.updatedAt,
          },
        })

    return result
  } catch (error: any) {
    console.error("[UPSERT_SUBCATEGORY]", error?.message)
    throw new Error("Failed to upsert subcategory.")
  }
}

// ❌ Delete subcategory
export const deleteSubCategoryById = async (id: string) => {
  try {
    await requireAdmin()

    return await db.subCategory.delete({
      where: { id },
    })
  } catch (error: any) {
    console.error("[DELETE_SUBCATEGORY_BY_ID]", error?.message)
    throw new Error("Failed to delete subcategory.")
  }
}

// 📦 Fetch all subcategories
export const getAllSubCategories = async () => {
  try {
    await requireAdmin()

    return await db.subCategory.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  } catch (error: any) {
    console.error("[GET_ALL_SUBCATEGORIES]", error?.message)
    throw new Error("Failed to fetch subcategories.")
  }
}

// 🔍 Get subcategory by ID
export const getSubCategoryById = async (id: string) => {
  try {
    await requireAdmin()

    const subCategory = await db.subCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        url: true,
        image: true,
        featured: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!subCategory) throw new Error("Subcategory not found.")

    return subCategory
  } catch (error: any) {
    console.error("[GET_SUBCATEGORY_BY_ID]", error?.message)
    throw new Error("Failed to fetch subcategory.")
  }
}

// 📂 Get subcategories by parent category ID
export const getSubCategoriesByCategoryId = async (categoryId: string) => {
  try {
    await requireAdmin()

    return await db.subCategory.findMany({
      where: { categoryId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        image: true,
        featured: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } catch (error: any) {
    console.error("[GET_SUBCATEGORIES_BY_CATEGORY_ID]", error?.message)
    throw new Error("Failed to fetch subcategories for category")
  }
}
