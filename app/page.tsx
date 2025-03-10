// import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const UIDArray = [234, 227, 43, 44, 42]

  return <main className="p-20">{JSON.stringify(UIDArray)}</main>
}
