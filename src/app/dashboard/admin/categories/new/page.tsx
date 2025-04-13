import CategoryForm from '@/components/dashboard/forms/category-details'
import React from 'react'


export default function AdminNewCategoryPage() {
  const CLOUDINARY_PRESET_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
  if (!CLOUDINARY_PRESET_NAME) { return null }
  return (
    <div className='w-full'>
      <CategoryForm cloudinaryKey = {CLOUDINARY_PRESET_NAME} />
    </div>
  )
}
