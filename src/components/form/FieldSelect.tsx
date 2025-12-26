import React from 'react'
import Required from '@/components/ui/Required'
import ErrorMessage from '@/components/ui/ErrorMessage'
import clsx from 'clsx'
import Label from '@/components/ui/Label'
import Select, { SelectOptions } from '@/components/ui/Select'

type FormSelectProps = React.InputHTMLAttributes<HTMLSelectElement> & {
  label: string
  errorMessage?: string
  name: string
  inputClassName?: string
  outerClassName?: string
  options: SelectOptions
}

export default function FieldSelect(props: FormSelectProps) {
  const { label, errorMessage, required, name, options, inputClassName, outerClassName, ...rest } =
    props
  return (
    <div className={clsx('flex flex-col gap-1', outerClassName)}>
      {label && (
        <div className="flex items-center">
          <Label name={name} label={label} />
          {required && <Required />}
        </div>
      )}
      <Select
        options={options}
        required={required}
        name={name}
        aria-label={label}
        aria-labelledby={label}
        className={inputClassName}
        {...rest}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  )
}
