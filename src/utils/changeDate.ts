export function timeSince(date: Date): string {
  const seconds: number = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval: number = seconds / 31536000

  if (interval >= 1) {
    return new Intl.NumberFormat(undefined, { style: 'unit', unit: 'year' }).format(Math.floor(interval))
  }

  interval = seconds / 2592000
  if (interval >= 1) {
    return new Intl.NumberFormat(undefined, { style: 'unit', unit: 'month' }).format(Math.floor(interval))
  }

  interval = seconds / 86400
  if (interval >= 1) {
    return new Intl.NumberFormat(undefined, { style: 'unit', unit: 'day' }).format(Math.floor(interval))
  }

  interval = seconds / 3600
  if (interval >= 1) {
    return new Intl.NumberFormat(undefined, { style: 'unit', unit: 'hour' }).format(Math.floor(interval))
  }

  interval = seconds / 60
  if (interval >= 1) {
    return new Intl.NumberFormat(undefined, { style: 'unit', unit: 'minute' }).format(Math.floor(interval))
  }

  return 'Just now'
}
