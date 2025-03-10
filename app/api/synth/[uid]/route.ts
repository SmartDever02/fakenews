import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { uid: number } }
) {
  function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  try {
    console.log('request: ', request)

    const uid = Number(params.uid)

    const synth = await prisma.synth.findFirst({
      where: { uid },
    })

    if (!synth) {
      console.error('No synth found for uid:', uid)
      return NextResponse.json({ error: 'No synth found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      sigma: getRandomFloat(synth.sigma[0], synth.sigma[1]),
      spread_factor: getRandomFloat(
        synth.spread_factor[0],
        synth.spread_factor[1]
      ),
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
