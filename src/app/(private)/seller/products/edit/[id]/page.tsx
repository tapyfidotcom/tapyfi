import PageTitle from "@/components/ui/page-title";
import React from "react";
import ProductForm from "../../_common/product-form";
import { getProductById } from "@/actions/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const response: any = await getProductById(id!);
  if (!response.success) {
    return <div>{response.message}</div>;
  }
  return (
    <div>
      <PageTitle title="Edit Product" />
      <ProductForm formType="edit" initialValues={response?.data[0]} />
    </div>
  );
}

export default EditProductPage;
