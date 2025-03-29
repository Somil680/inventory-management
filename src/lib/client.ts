'use server'

import { formatPrice } from '@/hooks/hook'
import prisma from './prisma'
import { Party } from './type'

export async function fetchParty() {
  try {
    const party = await prisma.party.findMany()
    return party.map((item) => ({
      ...item,
      receive_amount: formatPrice(item.receive_amount ?? 0),
      pay_amount: formatPrice(item.pay_amount ?? 0),
    }))
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}

// ✅ FETCH A PARTY DETAILS

// ✅ Create a PARTY
export async function createParty(inputItem: Party) {
  if (!inputItem || typeof inputItem !== 'object') {
    throw new Error('Invalid input: Product data is required')
  }
  try {
    console.log('🚀 ~ createProduct ~ inputItem:', inputItem)
    return await prisma.party.create({
      data: {
        name: inputItem.name,
        contact: Number(inputItem.contact),
        receive_amount: BigInt(
          Math.round(Number(inputItem.receive_amount ?? 0) * 100)
        ),
        pay_amount: BigInt(Math.round(Number(inputItem.pay_amount ?? 0) * 100)),
        gstIn: inputItem.gstIn,
        gst_type: inputItem.gst_type,
        address: inputItem.address,
        email: inputItem.email,
      },
    })
  } catch (error) {
    console.error('🚀 ~ createProduct ~ error:', error)
    throw new Error('Failed to create product')
  }
}
