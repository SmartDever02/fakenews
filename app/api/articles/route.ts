import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const Schema = z.object({
  uid: z.number(),
  article: z.string(),
  articles_to_review: z.array(z.string()),
  predictions: z.array(z.number()),
  original_predictions: z.array(z.number()).optional(),
  paraphrased_score: z.number(),
  fake_score: z.number().optional(),
  is_valid_first_try: z.boolean(),
  is_adjusted: z.boolean(),
  epoch_number: z.number().optional(),
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
      original_predictions,
      predictions,
      paraphrased_score,
      fake_score,
      is_valid_first_try,
      is_adjusted,
      epoch_number,
    } = parsedData.data

    const newPayload = await prisma.logs.create({
      data: {
        uid,
        article: article,
        articles_to_review: is_valid_first_try ? ['', ''] : articles_to_review,
        original_predictions,
        predictions,
        paraphrased_score,
        fake_score,
        is_first_try_valid: is_valid_first_try,
        is_adjusted,
        epoch_number,
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
