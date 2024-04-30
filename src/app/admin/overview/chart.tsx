import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

const LineChart = ({ accountData, postData }: { accountData: any; postData: any }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        // Destroy existing Chart instance
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        const defaultMonths = Array.from({ length: 12 }, (_, index) => index + 1).sort((a, b) => a - b)

        const accountMonths = accountData.map((entry: any) => entry._id.month)
        const accountUserCounts = accountData.map((entry: any) => entry.userCount)

        const postMonths = postData.map((entry: any) => entry._id.month)
        const postUserCounts = postData.map((entry: any) => entry.postCount)

        const combinedMonths = [...new Set([...accountMonths, ...postMonths, ...defaultMonths])]
        const sortedCombinedMonths = combinedMonths.sort((a, b) => a - b)
        const combinedAccountUserCounts = combinedMonths.map((month) => {
          const index = accountMonths.indexOf(month)
          return index !== -1 ? accountUserCounts[index] : 0
        })
        const combinedPostUserCounts = combinedMonths.map((month) => {
          const index = postMonths.indexOf(month)
          return index !== -1 ? postUserCounts[index] : 0
        })

        // Create a new Chart instance
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sortedCombinedMonths,
            datasets: [
              {
                label: 'Number Of Account',
                data: combinedAccountUserCounts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              },
              {
                label: 'Number Of Post',
                data: combinedPostUserCounts,
                fill: false,
                borderColor: 'rgb(192, 75, 75)',
                tension: 0.1
              }
            ]
          },
          options: {
            plugins: {
              legend: {
                labels: {
                  boxWidth: 20
                },
                title: {
                  display: true,
                  text: 'Overview Chart',
                  font: {
                    size: 30
                  }
                }
              }
            },
            layout: {
              padding: {
                bottom: 30,
                right: 10
              }
            }
          }
        })
      }
    }

    // Clean up: destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [accountData, postData])

  return <canvas ref={chartRef} />
}

export default LineChart