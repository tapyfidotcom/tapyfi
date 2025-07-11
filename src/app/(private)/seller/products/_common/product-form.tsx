"use client";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories } from "@/constants";
import toast from "react-hot-toast";
import { uploadFileAndGetUrl } from "@/utils/file-uploads";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { addNewProduct, editProductById } from "@/actions/products";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  formType?: "add" | "edit";
  initialValues?: any;
}

function ProductForm({
  formType = "add",
  initialValues = {},
}: ProductFormProps) {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [selectedFiles, setSelectedFiles] = React.useState<any[]>([]);
  const [existingProductImages, setExistingProductImages] = React.useState<any>(
    initialValues?.images || []
  );
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const productFormSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
    price: z.number().positive(),
    category: z.string().nonempty(),
    available_stock: z.number().positive(),
  });

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      category: initialValues?.category || "",
      available_stock: initialValues?.available_stock || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    try {
      setLoading(true);

      let urls = [...existingProductImages];
      for (const file of selectedFiles) {
        const response = await uploadFileAndGetUrl(file);
        if (response.success) {
          urls.push(response.url);
        } else {
          throw new Error(response.message);
        }
      }

      const payload = {
        ...values,
        images: urls,
        seller_id: user?.id,
      };

      let response: any = null;
      if (formType === "add") {
        response = await addNewProduct(payload);
      } else {
        response = await editProductById(initialValues.id, payload);
      }

      if (!response.success) {
        throw new Error(response.message);
      } else {
        toast.success(response.message);
        router.push("/seller/products");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error submitting form data");
    } finally {
      setLoading(false);
    }
  }

  const imageUrlsToDisplay = useMemo(() => {
    let urls: any = [];
    if (selectedFiles.length === 0) {
      return urls;
    }

    selectedFiles.forEach((file) => {
      urls.push(URL.createObjectURL(file));
    });

    return urls;
  }, [selectedFiles]);

  const onSelectedImageDelete = (index: number) => {
    try {
      const filteredFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(filteredFiles);
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  const onExistingImageDelete = (index: number) => {
    try {
      const filteredImages = existingProductImages.filter(
        (_: any, i: number) => i !== index
      );
      setExistingProductImages(filteredImages);
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-7">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-0">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-0">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem value={category.value} key={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product price"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter available stock"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Input
          placeholder="Select product images"
          type="file"
          multiple
          onChange={(e: any) => setSelectedFiles(Array.from(e.target.files))}
        />

        <div className="flex gap-5 mt-2 flex-wrap">
          {imageUrlsToDisplay.map((url: string, index: number) => (
            <div
              className="flex flex-col gap-2 border p-2 border-gray-300 items-center"
              key={index}
            >
              <img src={url} className="w-20 h-20 object-cover" />
              <span
                className="text-sm underline cursor-pointer"
                onClick={() => onSelectedImageDelete(index)}
              >
                Delete
              </span>
            </div>
          ))}

          {existingProductImages.map((url: string, index: number) => (
            <div
              className="flex flex-col gap-2 border p-2 border-gray-300 items-center"
              key={index}
            >
              <img src={url} className="w-20 h-20 object-cover" />
              <span
                className="text-sm underline cursor-pointer"
                onClick={() => onExistingImageDelete(index)}
              >
                Delete
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-5">
          {" "}
          <Button
            onClick={() => router.push("/seller/products")}
            disabled={loading}
            variant={"outline"}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;
