'use client'

import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

export default function ClientProvider(props: PropsWithChildren) {
  return (
    <>
      {props.children}
      <Toaster position='top-right' />
    </>
  )
}
