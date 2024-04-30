export default function TimeFormatter(time: number) {
  if (time === 0) {
    return '0:00'
  }

  const minute = Math.floor(time / 60)

  const second = Math.floor(time) % 60

  return `${minute}:${second}`
}
