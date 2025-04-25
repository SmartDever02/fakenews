import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// export async function GET(
//   request: Request,
//   { params }: { params: { hotkey_address: string } }
// ) {}

export async function POST(
  _request: Request,
  { params }: { params: { hotkey_address: string } }
) {
  const hotkey = params.hotkey_address

  if (!hotkey) {
    return NextResponse.json(
      { error: 'Hotkey address is not given' },
      { status: 400 }
    )
  }

  try {
    const maxLevel = await prisma.vidaio_hotkey_pool.aggregate({
      _max: {
        level: true,
      },
    })

    const biggestLevel = maxLevel._max.level || 0

    const pool = await prisma.vidaio_hotkey_pool.findFirst({
      where: {
        volume: {
          lt: Number(process.env.MAX_POOL_SIZE || 10),
        },
      },
      orderBy: {
        level: 'asc', // Lowest level first (higher priority)
      },
    })

    // no pool
    if (!pool) {
      const newPool = await prisma.vidaio_hotkey_pool.create({
        data: {
          level: biggestLevel + 1,
          volume: 1,
          hotkeyAddresses: [hotkey],
        },
      })

      return NextResponse.json({ pool: newPool })
    }

    // update pool
    const hotkeys = pool.hotkeyAddresses
    hotkeys.push(hotkey)
    const updatedPool = await prisma.vidaio_hotkey_pool.update({
      where: {
        id: pool.id,
      },
      data: {
        hotkeyAddresses: hotkeys,
        volume: hotkeys.length,
      },
    })

    return NextResponse.json({ pool: updatedPool })
  } catch (e) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { hotkey_address: string } }
) {
  const body = await request.json()
  const level = body?.level

  if (!level || !params?.hotkey_address) {
    return NextResponse.json(
      { error: 'One of hotkey address, level, id is not given' },
      { status: 400 }
    )
  }

  const hotkey = params.hotkey_address

  try {
    const pool = await prisma.vidaio_hotkey_pool.findUniqueOrThrow({
      where: {
        level,
        hotkeyAddresses: {
          has: hotkey,
        },
      },
    })

    const hotkeys = pool.hotkeyAddresses

    const index = hotkeys.indexOf(hotkey)
    if (index !== -1) {
      hotkeys.splice(index, 1) // removes only the first occurrence
    }

    console.log('Hotkeys to update: ', hotkeys, hotkeys.length)

    // update pool
    const updatedPool = await prisma.vidaio_hotkey_pool.update({
      where: {
        level,
      },
      data: {
        hotkeyAddresses: hotkeys,
        volume: hotkeys.length,
      },
    })

    return NextResponse.json({ pool: updatedPool })
  } catch (e) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
