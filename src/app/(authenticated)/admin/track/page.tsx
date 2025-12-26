import { TrackForm } from '@/features/(authenticated)/admin/track/components/TrackForm'
import { getTrackList } from '@/features/(authenticated)/admin/track/services/getTrackList'
import TrackDeleteButton from '@/features/(authenticated)/admin/track/components/TrackDeleteButton'
import TrackNameUpdateButton from '@/features/(authenticated)/admin/track/components/TrackNameUpdateButton'
import TrackDateUpdateButton from '@/features/(authenticated)/admin/track/components/TrackDateUpdateButton'
import TrackStatusUpdateButton from '@/features/(authenticated)/admin/track/components/TrackStatusUpdateButton'

// TODO: 트랙 생성 페이지 디자인 수정 필요
export default async function TrackPage() {
  const trackData = await getTrackList()

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2">
      {/* 왼쪽 */}
      <section className="border-b border-gray-300 p-6 md:border-r md:border-b-0">
        <div>
          <TrackForm />
        </div>
      </section>

      {/* 오른쪽 */}
      <section className="p-6">
        {trackData.content.length > 0 ? (
          <ul className="space-y-4">
            {trackData.content.map((track) => (
              <li
                key={track.trackId}
                className="relative flex items-center justify-between rounded-md border border-gray-200 p-4"
              >
                <div>
                  <h2 className="group flex items-center gap-2 text-lg font-semibold">
                    {track.trackName}{' '}
                    <TrackNameUpdateButton trackId={track.trackId} trackName={track.trackName} />
                  </h2>
                  <div className="group flex items-center gap-2 text-sm font-semibold text-gray-600">
                    기간: {track.startDate.toString()} ~ {track.endDate.toString()}
                    <TrackDateUpdateButton
                      trackId={track.trackId}
                      startDate={track.startDate}
                      endDate={track.endDate}
                    />
                  </div>
                  <div className="group flex items-center gap-2 text-sm font-semibold text-gray-600">
                    상태: {track.trackStatus}
                    <TrackStatusUpdateButton
                      trackId={track.trackId}
                      trackStatus={track.trackStatus}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrackDeleteButton id={track.trackId} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">생성된 트랙이 없습니다.</p>
        )}
      </section>
    </div>
  )
}
