import Feed from '@/components/layout/aside/Feed'
import Dashboard from './Dashboard'

const Aside = () => {
  return (
    <aside className="sticky top-[89px] h-full min-w-72">
      <div className="space-y-5">
        <Feed />
        <Dashboard />
      </div>
    </aside>
  )
}

export default Aside
