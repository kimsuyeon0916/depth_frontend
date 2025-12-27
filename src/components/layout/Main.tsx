import React from 'react'

export default async function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto flex w-full flex-col gap-5 lg:flex-row">{children}</div>
    </div>
  )
}
