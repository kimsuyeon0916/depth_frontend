import {
  Ellipsis,
  Loader,
  LoaderCircle,
  LoaderPinwheel,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'

const ICONS = {
  ellipsis: Ellipsis,
  loader: Loader,
  pinwheel: LoaderPinwheel,
  circle: LoaderCircle,
} satisfies Record<string, LucideIcon>

export type LoadingProps = LucideProps & {
  variant?: keyof typeof ICONS
  label?: string
}

export function Loading({ variant = 'loader', label, ...iconProps }: LoadingProps) {
  const Icon = ICONS[variant]
  return (
    <div role="status" className="flex items-center justify-center" aria-label={label ?? 'Loading'}>
      <Icon {...iconProps} />
      {label && <p className="text-xs">{label}</p>}
    </div>
  )
}
