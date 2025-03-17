'use client'
import { Button } from '@/components/ui/button'
import FloatingInput from '@/components/ui/floating-input'
// import { openModal } from '@/redux/slices/modal'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  fetchProperties,
} from '@/lib/actions'
import { FilePenLine, Trash2 } from 'lucide-react'

const Items = () => {
  const queryClient = useQueryClient()
  const [categoryData, setCategoryData] = useState({
    category: '',
    sub_category: '',
    category_id: '',
  })

  const { data } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })

  const categoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      // queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Successfully created category')
      setCategoryData((prev) => ({ ...prev, category: '' }))
    },
    onError: (error) => {
      toast.error(`Error on Creating category: ${error.message}`)
      console.log('🚀 ~ Items ~ error:', error)
    },
  })
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Successfully delete category')
      setCategoryData((prev) => ({ ...prev, category: '' }))
    },
    onError: (error) => {
      toast.error(`Error on delete category: ${error.message}`)
      console.log('🚀 ~ Items ~ error:', error)
    },
  })
  const deleteSubCategoryMutation = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Successfully delete Subcategory')
    },
    onError: (error) => {
      toast.error(`Error on delete category: ${error.message}`)
      console.log('🚀 ~ Items ~ error:', error)
    },
  })
  const subCategoryMutation = useMutation({
    mutationKey: ['properties'],
    mutationFn: createSubCategory,
    onSuccess: () => {
      console.log('🚀 ~ Items ~ data:', data)
      queryClient.invalidateQueries({
        queryKey: ['properties'],
        refetchType: 'all',
      })
      toast.success('Successfully created Subcategory')
      setCategoryData((prev) => ({
        ...prev,
        sub_category: '',
        category_id: '',
      }))
    },
    onError: (error) => {
      toast.error(`Error on Creating Subcategory: ${error.message}`)
      console.log('🚀 ~ Items ~ error:', error)
    },
  })

  return (
    <main className="w-full flex flex-col  gap-3 h-full p-3 ">
      <div className="flex gap-3 ">
        <section className="bg-white shadow-lg w-1/2 p-3 space-y-3 ">
          <p className="font-semibold">Add New Category</p>
          <div className="flex w-full gap-2 items-center">
            <FloatingInput
              label="Add Category"
              removeText={() =>
                setCategoryData((prev) => ({ ...prev, title: '' }))
              }
              value={categoryData.category}
              onChange={(e) =>
                setCategoryData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full"
            />

            <Button
              disabled={categoryData.category === ''}
              onClick={() =>
                categoryMutation.mutate({ title: categoryData.category })
              }
            >
              Add
            </Button>
          </div>
        </section>
        <section className="bg-white shadow-lg w-1/2 p-3 space-y-3  ">
          <p className="font-semibold">Add New Sub-Category</p>
          <div className="flex w-full gap-2 items-center">
            <FloatingInput
              label="Add Sub Category"
              removeText={() =>
                setCategoryData((prev) => ({ ...prev, title: '' }))
              }
              value={categoryData.sub_category}
              onChange={(e) =>
                setCategoryData((prev) => ({
                  ...prev,
                  sub_category: e.target.value,
                }))
              }
              className="w-full"
            />
            <Select
              required
              value={categoryData.category_id}
              onValueChange={(value) =>
                setCategoryData((prev) => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Linked To" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data &&
                    data.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={
                categoryData.sub_category === '' &&
                categoryData.category_id === ''
              }
              onClick={() =>
                subCategoryMutation.mutate({
                  title: categoryData.sub_category,
                  category_id: categoryData.category_id,
                })
              }
            >
              Add
            </Button>
          </div>
        </section>
      </div>

      <section className="bg-white shadow-lg w-full p-3 h-full  ">
        <Table>
          <TableCaption>A list of your recent Data.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]">Sl.no</TableHead>
              <TableHead className="">Category Name</TableHead>
              <TableHead className="">Sub Category Name</TableHead>
              <TableHead className="text-right">Total Item Linked</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="">{index + 1}</TableCell>
                  <TableCell className="">
                    {item.title?.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell className="">
                    <Table key={item.id}>
                      <TableBody>
                        {item?.sub_category.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell key={item.id} className="">
                              {item.title}
                            </TableCell>
                            <TableCell className="text-right space-x-2  hover:block">
                              <Button variant={'outline'} size={'icon'}>
                                <FilePenLine />
                              </Button>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() =>
                                  deleteSubCategoryMutation.mutate(item.id)
                                }
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.sub_category.length}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant={'outline'} size={'icon'}>
                      <FilePenLine />
                    </Button>
                    <Button
                      variant={'outline'}
                      size={'icon'}
                      onClick={() => deleteCategoryMutation.mutate(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </main>
  )
}

export default Items
