'use client'

import React from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

export type SelectOptions = {
  value: string
  label: string
  disabled?: boolean
}[]

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string
  options: SelectOptions
  placeholder?: string
  wrapperClassName?: string
}

export default function Select({
  name,
  options,
  placeholder = '선택하세요',
  defaultValue = '',
  className,
  wrapperClassName,
  ...rest
}: SelectProps) {
  return (
    <div className={clsx('relative w-full', wrapperClassName)}>
      <select
        name={name}
        defaultValue={defaultValue ?? ''}
        className={clsx(
          'h-9 w-full rounded-lg bg-[#F4F4F5] px-3 pr-9 text-sm outline-none',
          'appearance-none',
          'text-[#717182]',
          'focus:ring-0 focus:ring-gray-300',
          className,
        )}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value || '__empty__'} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#717182]/50"
        aria-hidden="true"
      />
    </div>
  )
}
