import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const UIDArray = [234, 227, 43, 44, 42]

  let arr = []
  for (let i = 0; i < UIDArray.length; i++) {
    const data = await prisma.logs.findMany({
      where: { uid: UIDArray[i] },
      take: 250,
    })
    const count = data.filter(
      (elem) => elem.is_first_try_valid === false
    ).length
    arr.push(count)
  }

  return (
    <main className="p-20">
      <ul>
        {UIDArray.map((uid, index) => (
          <li key={uid}>
            UID: {uid} Invalid count: {arr[index]}
          </li>
        ))}
      </ul>
    </main>
  )
}
