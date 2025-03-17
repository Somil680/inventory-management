import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
       const category = await prisma.category.findMany()
       const sub_category = await prisma.sub_category.findMany()
    return NextResponse.json({ category, sub_category }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
