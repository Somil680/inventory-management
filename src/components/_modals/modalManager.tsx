'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { X } from 'lucide-react'

import Item_modal from './ItemsModal'
import Party_modal from './PartyModal'

const ModalManager: React.FC = () => {
  const dispatch = useDispatch()

  const { activeModal } = useSelector((state: RootState) => state.modal)

//   function handleClose() {
//     dispatch(closeModal())
    //   }
    

  useEffect(() => {
    if (activeModal !== null) document.body.style.overflow = 'hidden'
    else
      setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 500)
  }, [activeModal])

  return (
    <section>
      {activeModal !== null && (
        <div className=" fixed top-0 left-0 w-full h-full z-40 grid content-center items-center justify-items-center overflow-y-auto py-10 bg-[#00000077] ">
          <main className="relative  w-[1200px] h-fit bg-white  z-50 ">
            {activeModal === 'Items' && <Item_modal />}
            {activeModal === 'Party' && <Party_modal />}

            <span
              className="absolute top-6 right-4 cursor-pointer h-8 w-8 grid place-items-center rounded-full hover:bg-[#5d49ab2f]"
              onClick={() => dispatch(closeModal())}
            >
              <X />
            </span>
          </main>
        </div>
      )}
    </section>
  )
}

export default ModalManager


