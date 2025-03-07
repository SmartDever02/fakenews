import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function Page() {
  const articles = await prisma.logs.findMany()

  return (
    <main className="p-20">
      <ul className="space-y-2 max-w-[800px] mx-auto">
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/article/${article.id}`} className='hover:underline'>
              <p className="border rounded-md border-white/10 p-3 hover:border-white/30">
                {article.id}: {article.article.slice(0, 100)}...
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
