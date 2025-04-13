import SubCategoryFormDialog from '@/components/dashboard/forms/subcategory-details'
import { getAllCategories } from '@/queris/categoryQueries'
import React from 'react'

export default async function AdminNewSubCategoryPage() {
    const CLOUDINARY_PRESET_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
  if (!CLOUDINARY_PRESET_NAME) { return null }
  const categories = await getAllCategories();

  
  return (
    <div className='w-full'>
        <SubCategoryFormDialog categories={categories} cloudinaryKey = {CLOUDINARY_PRESET_NAME} />
    </div>
  )
}
