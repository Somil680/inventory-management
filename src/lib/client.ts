"use server"

import prisma from "./prisma"


export async function fetchParty() {
  try {
    return await prisma.party.findMany(
      // {
      // select: {
      //   // id: true,
      //   name: true,
      //   // contact: true,
      //   // receive_amount: true,
      //   // pay_amount: true,
      //   // gstIn: true,
      //   // gst_type: true,
      //   // address: true,
      //   // email: true,
      // },
      // }
    )
  } catch (error) {
    console.log('🚀 ~ fetchProperties ~ error:', error)
    throw new Error('Failed to fetch properties')
  }
}