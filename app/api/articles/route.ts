import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const Schema = z.object({
  article: z.string(),
  articles_to_review: z.array(z.string()),
  predictions: z.array(z.number()),
  paraphrased_score: z.number(),
  is_valid_first_try: z.boolean(),
  is_adjusted: z.boolean(),
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
      article,
      articles_to_review,
      predictions,
      paraphrased_score,
      is_valid_first_try,
      is_adjusted,
    } = parsedData.data

    let is_valid_score_format = true

    const p1 = predictions.at(0) || 0
    const p2 = predictions.at(1) || 0

    if ((p1 > 0.5 && p2 > 0.5) || (p1 <= 0.5 && p2 <= 0.5)) {
      is_valid_score_format = false
    }

    const newPayload = await prisma.logs.create({
      data: {
        article,
        articles_to_review,
        predictions,
        paraphrased_score,
        is_first_try_valid: is_valid_first_try,
        is_adjusted,
        is_valid_score_format,
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
