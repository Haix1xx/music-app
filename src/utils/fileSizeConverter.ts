export default function FormatByte(bytes: number) {
  if (bytes === 0) {
    return '0B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  const unit = Math.floor(Math.log(bytes) / Math.log(k))

  const formattedSize = parseFloat((bytes / Math.pow(k, unit)).toFixed(2))

  return `${formattedSize}${sizes[unit]}`
}
