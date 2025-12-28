import { TOPIC_TYPE, TOPIC_LABEL } from "@/types/Topic.types";
import { Briefcase, House, FileText, MessageCircle } from 'lucide-react'


export const TABS = [
  { id: TOPIC_TYPE.ALL, label: TOPIC_LABEL.ALL, href: '/', icon: <House /> },
  { id: TOPIC_TYPE.NOTICE, label: TOPIC_LABEL.NOTICE, href: '/notice', icon: <FileText /> },
  {
    id: TOPIC_TYPE.EMPLOYMENT_TIP,
    label: TOPIC_LABEL.EMPLOYMENT_TIP,
    href: '/job-tips',
    icon: <Briefcase />,
  },
  // { id: TOPIC_TYPE.TREND, label: TOPIC_LABEL.TREND, href: '/trend', icon: <TrendingUp /> },
  {
    id: TOPIC_TYPE.KNOWLEDGE,
    label: TOPIC_LABEL.KNOWLEDGE,
    href: '/knowledge',
    icon: <MessageCircle />,
  },
]
