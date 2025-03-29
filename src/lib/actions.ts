'use server'

import prisma from './prisma'
export async function fetchProperties() {
  try {
    return await prisma.category.findMany({
      include: { sub_category: true }, // Includes subcategories in the response
    })
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}
// ✅ Create a new category
export async function createCategory(data: { title: string }) {
  try {
    return await prisma.category.create({ data })
  } catch (error) {
    console.log('🚀 ~ createCategory ~ error:', error)
    throw new Error('Failed to create category')
  }
}
// ✅ Create a subcategory
export async function createSubCategory(data: {
  title: string
  category_id: string
}) {
  try {
    return await prisma.sub_category.create({ data })
  } catch (error) {
    console.log('🚀 ~ createSubCategory ~ error:', error)
    throw new Error('Failed to create subcategory')
  }
}

// ✅ Delete a category
export async function deleteCategory(id: string) {
  try {
    return await prisma.category.delete({ where: { id } })
  } catch (error) {
    console.log('🚀 ~ deleteCategory ~ error:', error)
    throw new Error('Failed to delete category')
  }
}

// ✅ Update a category
export async function updateCategory(id: string, data: { title: string }) {
  try {
    return await prisma.category.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.log('🚀 ~ updateCategory ~ error:', error)
    throw new Error('Failed to update category')
  }
}

// ✅ Update a subcategory
export async function updateSubCategory(id: string, data: { title: string }) {
  try {
    return await prisma.sub_category.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.log('🚀 ~ updateSubCategory ~ error:', error)
    throw new Error('Failed to update subcategory')
  }
}

// ✅ Delete a subcategory
export async function deleteSubCategory(id: string) {
  try {
    return await prisma.sub_category.delete({ where: { id } })
  } catch (error) {
    console.log('🚀 ~ deleteSubCategory ~ error:', error)
    throw new Error('Failed to delete subcategory')
  }
}


/** Create a new  Product
 */

