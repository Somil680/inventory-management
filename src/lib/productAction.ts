'use server'

import prisma from './prisma'
import { Product } from './type'

// * THIS WILL FETCH PRODUCTS
export async function fetchProduct() {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        hsn: true,
        category: true,
        sub_category: true,
        unit: true,
        sale_price: true,
        purchase_price: true,
        taxs: true,
        opening_quantity: true,
        location: true,
        sub_category_product: true,
        category_product: true,
      },
    })
  } catch (error) {
    console.log('🚀 ~ fetchProduct ~ error:', error)
    throw new Error('Failed to fetchProduct')
  }
}

// * THIS WILL CREATE PRODUCT
export async function createProduct(products: Product) {
  if (!products || typeof products !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }

  try {
    console.log('🚀 ~ createProduct ~ products:', products)
    return await prisma.product.create({
      data: {
        name: products.name,
        category: products.category,
        hsn: products.hsn,
        location: products.location,
        opening_quantity: Number(products.opening_quantity),
        purchase_price: Number(products.purchase_price),
        sale_price: Number(products.sale_price),
        sub_category: products.sub_category,
        taxs: products.taxs,
        unit: products.unit,
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
// * THIS WILL UPDATE PRODUCT
export async function updateProduct(products: Product , id :string) {
  if (!products || typeof products !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }

  try {
    console.log('🚀 ~ createProduct ~ products:', products)
    return await prisma.product.update({
      where : {id : id},
      data: {
        name: products.name,
        category: products.category,
        hsn: products.hsn,
        location: products.location,
        opening_quantity: Number(products.opening_quantity),
        purchase_price: Number(products.purchase_price),
        sale_price: Number(products.sale_price),
        sub_category: products.sub_category,
        taxs: products.taxs,
        unit: products.unit,
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
