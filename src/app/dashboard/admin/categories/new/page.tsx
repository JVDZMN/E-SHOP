'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormValues } from '@/schemas/category.schema';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function CategoryForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      image: '',
      url: '',
      featured: false,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      // You'd replace this with an API call to create the category
      console.log('Form Data:', data);
    } catch (error) {
      console.error('Error submitting category', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} disabled={loading} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" {...register('image')} disabled={loading} />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input id="url" {...register('url')} disabled={loading} />
        {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="featured" {...register('featured')} />
        <Label htmlFor="featured">Featured</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create Category'}
      </Button>
    </form>
  );
}
