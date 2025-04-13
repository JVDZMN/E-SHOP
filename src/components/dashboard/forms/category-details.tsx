"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Category } from "@prisma/client"
import { categorySchema, CategoryFormValues } from "@/schemas/category.schema"
import { upsertCategory } from "@/actions/upsert-category"; // ✅ safe server action

import {v4} from 'uuid'

//UI
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import ImageUpload from "../shared/image-upload"
import { useRouter } from "next/navigation"

type Props = {
  data?: Category,
  cloudinaryKey:string
}



export default function CategoryFormDialog({ data,cloudinaryKey }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: [{ url: data.image }],
        url: data.url,
        featured: data.featured,
      })
    }
  }, [data, form])

  const handleSubmit = async (values: CategoryFormValues) => {
  try {
    setIsLoading(true);

    const categoryPayload = {
      name: values.name,
      url: values.url,
      image: values.image[0]?.url || "",
      featured: values.featured,
      createdAt: data?.createdAt || new Date(),
      updatedAt: new Date(),
      ...(data?.id ? { id: data.id } : {}) // ✅ this line is the key
    };


    const result = await upsertCategory(categoryPayload);
    toast.success("Category saved successfully!");
    // Optionally refresh data, close dialog, etc.
    if (data?.id) { router.refresh() }
    else {
      router.push('/dashboard/admin/categories')
    }

  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Something went wrong while saving category.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AlertDialog open>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update "${data.name}" category information.`
              : "Let's create a category. You can edit it later from the category table or page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) => field.onChange([...field.value.filter(
                            (current) => current.url !== url
                          )])}
                          dontShowPreview={false}
                          cloudinaryKey={cloudinaryKey} />
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on the homepage.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Saving..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}





