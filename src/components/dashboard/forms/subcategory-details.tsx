"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Category, SubCategory } from "@prisma/client"
import { toast } from "sonner"
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
import { SubCategoryFormValues, subCategorySchema } from "@/schemas/subcategory.schema"
import { upsertSubCategory } from "@/queris/subCategoryQueries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  data?: SubCategory
  cloudinaryKey: string
  categories:Category[]
}

export default function SubCategoryFormDialog({ data,categories, cloudinaryKey }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId,
      
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: [{ url: data.image }],
        url: data.url,
        featured: data.featured,
        categoryId: data.categoryId,
      })
    }
  }, [data, form])


  const handleSubmit = async (values: SubCategoryFormValues) => {
    try {
      setIsLoading(true)

      if (!values.categoryId) {
      toast.error("Please select a category.");
      return;
    }
      const subCategoryPayload = {
        name: values.name,
        url: values.url,
        image: values.image[0]?.url || "",
        featured: values.featured,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date(),
        categoryId: values?.categoryId,
        ...(data?.id ? { id: data.id } : {})
      }

      const response = await upsertSubCategory(subCategoryPayload)
      toast.success("Subcategory saved successfully!")

      if (response?.id) {
        router.refresh()
      } else {
        router.push(`/dashboard/admin/categories/${values.url}/subcategories`)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong while saving subcategory.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <AlertDialog open>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Subcategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update "${data.name}" subcategory information.`
              : "Create a new subcategory under the selected category."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                        onRemove={(url) =>
                          field.onChange([...field.value.filter((current) => current.url !== url)])
                        }
                        dontShowPreview={false}
                        cloudinaryKey={cloudinaryKey}
                      />
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Subcategory name" {...field} />
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
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/subcategory-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    
                      <Select disabled={isLoading || categories.length === 0} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{ category.name}</SelectItem>
                        ))}
                      </SelectContent>
                      </Select>
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
                        This subcategory will appear on the homepage if featured.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Saving..."
                  : data?.id
                  ? "Update Subcategory"
                  : "Create Subcategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}
