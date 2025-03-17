import React from 'react'
import { EllipsisVertical } from 'lucide-react'
import { openModal } from '@/redux/slices/modal'
import { useDispatch } from 'react-redux'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Party, Product } from '@/lib/type'

type EditDataType =
  | { type: 'Items'; editData: Product}
  | { type: 'Party'; editData: Party }
  | { type: ''; editData: [] }

const ActionButton: React.FC<EditDataType> = ({ type, editData }) => {
//   console.log("🚀 ~ editData:", editData)
  const dispatch = useDispatch()
  const handleOpenModal = () => {
    dispatch(
      openModal({
        type: type,
        editData: editData,
      })
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical size={20} color="gray" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2">
        <DropdownMenuItem onClick={handleOpenModal}>
          View / Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
         Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionButton
