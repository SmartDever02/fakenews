import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const Schema = z.object({
  uid: z.number(),
  trust: z.number(),
  stake: z.number(),
  incentive: z.number(),
  emission: z.number(),
})

export async function POST(req: Request) {
  try {
    const jsonData = await req.json()
    const parsedData = Schema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const { uid, emission, incentive, stake, trust } = parsedData.data

    const newPayload = await prisma.metagraph.upsert({
      where: { uid },
      create: { uid, emission, incentive, stake, trust },
      update: { emission, incentive, stake, trust },
    })

    return NextResponse.json({ success: true, data: newPayload })
  } catch (error) {
    console.error('Error updating params:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
