export default async function Page({ params }: { params: { id: number } }) {
  return (
    <main className="p-20">
      <h2 className="text-xl text-center font-semibold pb-20">
        Epoch {params.id}
      </h2>
    </main>
  )
}
