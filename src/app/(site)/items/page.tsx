'use client'
import { openModal } from '@/redux/slices/modal'
import React from 'react'
import { useDispatch } from 'react-redux'

const Items = () => {
const dispatch  =  useDispatch()
    const open = () => {
        dispatch(
            openModal({
                type: 'Items',
            })
         
        )
        
        console.log("🚀 ~ open ~ open:", )
        
    }
  return (
    <div>
      THIS IS ITEM PAGE
      <button onClick={() => open()}>open</button>
     
    </div>
  )
}

export default Items
