import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const article = await prisma.logs.findUnique({
    where: { id: Number(params.id) },
  })

  if (!article) {
    return notFound()
  }

  return (
    <main className="p-20">
      <Link className='underline sticky top-20 left-0' href="/">Home</Link>
      <h1 className="text-center mb-2">Original article</h1>
      <pre className="border p-2 border-white/40 rounded-md whitespace-pre-wrap max-w-[600px] mx-auto text-sm mb-4">
        {article.article}
      </pre>

      <h2 className="text-center mb-2">Fakes</h2>
      <div className="flex gap-4">
        {article.articles_to_review.map((fake, index) => (
          <pre
            key={index}
            className="border p-2 rounded-md border-white/40 whitespace-pre-wrap max-w-[600px] mx-auto text-sm mb-4"
          >
            {fake}
          </pre>
        ))}
      </div>
    </main>
  )
}
