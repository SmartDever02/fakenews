import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const Schema = z.object({
  uid: z.number(),
  article: z.string(),
  articles_to_review: z.array(z.string()),
  predictions: z.array(z.number()),
  predictions_v2: z.array(z.number()).optional(),
  epoch_number: z.number().optional(),
  token_length: z.number().optional(),
  processing_time: z.number().optional(),
  validator_uid: z.number().optional(),
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

    const {
      uid,
      article,
      articles_to_review,
      predictions,
      epoch_number,
      processing_time,
      validator_uid,
      predictions_v2,
    } = parsedData.data

    const newPayload = await prisma.logs.create({
      data: {
        uid,
        article: article,
        articles_to_review: articles_to_review,
        predictions,
        epoch_number,
        processing_time,
        validator_uid,
        predictions_v2,
      },
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
