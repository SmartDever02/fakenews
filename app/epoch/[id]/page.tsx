import prisma from '@/lib/prisma'

export default async function Page({ params }: { params: { id: number } }) {
  const logsPerMiner = await prisma.logs.groupBy({
    by: ['uid'],
    where: { epoch_number: Number(params.id) },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  // Invalid logs per miner
  const invalidLogsPerMiner = await prisma.logs.groupBy({
    by: ['uid'],
    where: {
      epoch_number: Number(params.id),
      OR: [{ is_first_try_valid: false }, { is_adjusted: true }],
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  return (
    <main className="p-20">
      <h2 className="text-xl text-center font-semibold pb-20">
        Epoch {params.id}
      </h2>
      {logsPerMiner.length === 0 && invalidLogsPerMiner.length === 0 ? (
        <p className="text-center">No logs found for this epoch.</p>
      ) : (
        <>
          <h3 className="text-xl text-center font-semibold pb-10">
            Logs per miner
          </h3>
          <ul>
            {logsPerMiner.map(({ uid, _count }) => (
              <li key={uid}>
                Miner: {uid}, Logs: {_count.id} (Skipped logs:{' '}
                {
                  invalidLogsPerMiner.find((item) => item.uid === uid)?._count
                    ?.id
                }
                )
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
