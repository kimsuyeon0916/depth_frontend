import { Suspense } from 'react'
import MiddleModal from '@/components/modal/MiddleModal'
import ModalMessage from '@/components/modal/components/ModalMessage'

export default function MessagePage() {
  return (
    // TODO: 추후 로딩/스켈레톤 컴포넌트 대체
    <Suspense fallback={null}>
      <MiddleModal>
        <ModalMessage buttonMessage="홈으로 이동" />
      </MiddleModal>
    </Suspense>
  )
}
