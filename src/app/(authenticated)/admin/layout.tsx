import React from 'react'
import AppShell from '@/components/layout/header/AppShell'
import Main from '@/components/layout/Main'
import AdminPageButton from '@/features/(authenticated)/admin/root/components/AdminPageButton'

export default async function AdminLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <AppShell location="admin">
      <Main>
        <section className="w-full">
          <AdminPageButton />
          <div className="pt-4">{children}</div>
        </section>
      </Main>
      {modal}
    </AppShell>
  )
}
