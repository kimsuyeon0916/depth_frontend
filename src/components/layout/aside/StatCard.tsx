import clsx from 'clsx'

type StatVariant = 'blue' | 'green' | 'orange'

const STAT_VARIANTS: Record<StatVariant, { container: string; icon: string }> = {
  blue: {
    // linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)
    container: 'bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_100%)] !border-[#DBEAFE]',
    // icon container bg: #DBEAFE, stroke: #155DFC (currentColor면 text로 제어됨)
    icon: 'bg-[#DBEAFE] text-[#155DFC]',
  },
  green: {
    // linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)
    container: 'bg-[linear-gradient(135deg,#F0FDF4_0%,#FFFFFF_100%)] !border-[#DCFCE7]',
    // icon container bg: #DCFCE7, stroke: #00A63E
    icon: 'bg-[#DCFCE7] text-[#00A63E]',
  },
  orange: {
    // linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)
    container: 'bg-[linear-gradient(135deg,#FFF7ED_0%,#FFFFFF_100%)] !border-[#FFEDD4]',
    // icon container bg: #FFEDD4, stroke: #F54900
    icon: 'bg-[#FFEDD4] text-[#F54900]',
  },
}

type StatCardProps = {
  label: string
  value: string
  icon: React.ReactNode
  variant: StatVariant
}

const StatCard = ({ label, value, icon, variant }: StatCardProps) => {
  const styles = STAT_VARIANTS[variant]

  return (
    <div
      className={clsx(
        'flex items-start justify-between rounded-[10px] border p-3',
        styles.container,
      )}
    >
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-[#6A7282]">{label}</span>
        <span className="mt-1 text-[24px] leading-[30px] font-normal text-[#101828]">{value}</span>
      </div>

      <div className={clsx('flex size-7 items-center justify-center rounded-[10px]', styles.icon)}>
        {icon}
      </div>
    </div>
  )
}

export default StatCard
