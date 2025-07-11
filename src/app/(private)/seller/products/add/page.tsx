import PageTitle from '@/components/ui/page-title'
import React from 'react'
import ProductForm from '../_common/product-form'

function AddProductPage() {
  return (
    <div>
        <PageTitle title="Add Product" />
        <ProductForm formType="add" />
    </div>
  )
}

export default AddProductPage