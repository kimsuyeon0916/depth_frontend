'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../apis/dashboard.api'
import { GetDashboardResponse } from '../types/Dashboard.type'

const dashboardKey = () => ['dashboard'] as const

export function useGetDashboardQuery() {
  return useQuery<GetDashboardResponse>({
    queryKey: dashboardKey(),
    queryFn: () => getDashboard(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  })
}
