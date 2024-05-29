'use client'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const getChartDate = (date: Dayjs) => date.toISOString().substring(0, 10)
  const router = useRouter()
  router.push(`/charts/${getChartDate(dayjs().add(7, 'hour'))}`)
}
