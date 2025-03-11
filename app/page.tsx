import prisma from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 300

export default async function Page() {
  const epoches = await prisma.logs.groupBy({
    by: 'epoch_number',
    orderBy: {
      epoch_number: 'desc',
    },
  })

  return (
    <main className="p-20">
      <ul>
        {epoches.map((epoch) => (
          <li key={epoch.epoch_number}>
            <Link className='underline' href={`/epoch/${epoch.epoch_number}`}>
              {epoch.epoch_number}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
