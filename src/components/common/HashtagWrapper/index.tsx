import React from 'react'
import Link from 'next/link'

interface HashtagWrapperProps {
  text: string
  length?: number | undefined
}

const HashtagWrapper: React.FC<HashtagWrapperProps> = ({ text, length }) => {
  let isOverLength = false
  if (length && text.length > length) {
    text = text.slice(0, length)
    isOverLength = true
  }
  const regex = /#(\w+)/g
  const regexLink = /(https:\/\/\S+)|#(\w+)/g
  const matches: { hashtag: string; index: number; isLink?: boolean }[] = []
  let match

  while ((match = regexLink.exec(text))) {
    const hashtag = match[0]
    const { index } = match
    const isLink = match[1] !== undefined

    matches.push({ hashtag, index, isLink })
  }

  const segments: React.ReactNode[] = []
  let lastIndex = 0

  for (const match of matches) {
    const { hashtag, index, isLink } = match

    // Add the text segment before the hashtag or link
    segments.push(<span key={lastIndex}>{text.slice(lastIndex, index)}</span>)

    // Render the hashtag or link accordingly
    if (isLink) {
      segments.push(
        <a key={index} href={hashtag} style={{ color: 'blue' }} target='_blank' rel='noopener noreferrer'>
          {hashtag}
        </a>
      )
    } else {
      // Add the hashtag
      const href = `/search?q=${encodeURIComponent(hashtag)}&f=top`
      segments.push(
        <Link key={index} href={href} style={{ color: 'blue' }}>
          {hashtag}
        </Link>
      )
    }

    lastIndex = index + hashtag.length
  }

  // Add the remaining text
  segments.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>)

  if (isOverLength) {
    segments.push(
      <span key={lastIndex + 1} style={{ fontWeight: '600' }}>
        {' ...'}
      </span>
    )
  }

  return <div style={{ whiteSpace: 'pre-line' }}>{segments}</div>
}

export default HashtagWrapper
