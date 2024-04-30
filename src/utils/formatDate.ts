export default function formatDate(inputDate: string) {
  let currentDate = new Date()
  let providedDate = new Date(inputDate)

  // Calculate yesterday's date
  let yesterday = new Date()
  yesterday.setDate(currentDate.getDate() - 1)

  // Calculate last Sunday's date
  let lastSunday = new Date()
  lastSunday.setDate(currentDate.getDate() - currentDate.getDay())

  // Format provided date without time information
  providedDate.setHours(0, 0, 0, 0)

  if (providedDate.toDateString() === currentDate.toDateString()) {
    return 'Today'
  } else if (providedDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else if (providedDate >= lastSunday && providedDate <= currentDate) {
    return providedDate.toLocaleDateString('en-US', { weekday: 'long' })
  } else {
    return providedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }
}
