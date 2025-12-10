import React from 'react';
import Link from "next/link";

export default async function Logo() {
  return (
    <Link href="/">
      <div className="mr-5 flex shrink-0 items-center">
        <p className="text-2xl font-bold">Depth</p>
      </div>
    </Link>
  )
}
