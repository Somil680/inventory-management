import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { fetchProperties } from '@/lib/actions'
import { Product } from '@/lib/type'

interface CategorySubcategorySelectProps {
  inputItem: Product
  setItemInput: React.Dispatch<React.SetStateAction<Product>>
}

const CategorySubcategorySelect = ({
  inputItem,
  setItemInput,
}: CategorySubcategorySelectProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })

  const [selectedCategory, setSelectedCategory] = useState<string>(
    inputItem.category || ''
  )

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setItemInput({ ...inputItem, category: value, sub_category: '' })
  }

  const handleSubCategoryChange = (value: string) => {
    setItemInput({ ...inputItem, sub_category: value })
  }

  return (
    <>
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {isLoading
              ? 'Loading...'
              : data &&
                data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedCategory && (
        <Select
          value={inputItem.sub_category || undefined}
          onValueChange={handleSubCategoryChange}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {data &&
                data
                  .filter((items) => items.id === inputItem.category)
                  .map((item) =>
                    item.sub_category.map((subItem) => (
                      <SelectItem key={subItem.id} value={subItem.id}>
                        {subItem.title}
                      </SelectItem>
                    ))
                  )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </>
  )
}

export default CategorySubcategorySelect
