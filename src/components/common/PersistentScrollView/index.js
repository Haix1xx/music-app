// PersistentScrollView.js
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'

const PersistentScrollView = ({ children, id, name = 'scrollPosition' }) => {
  const pathname = usePathname()
  const [scrollPosition, setScrollPosition] = useState(0)
  const divRef = useRef(null)

  // Save scroll position to local storage when it changes
  useEffect(() => {}, [scrollPosition])

  useEffect(() => {
    const storedScrollPosition = localStorage.getItem(pathname)
    if (storedScrollPosition !== null) {
      setScrollPosition(parseInt(storedScrollPosition, 10))
    }
  }, []) // Empty dependency array ensures it only runs on mount

  // Handle scroll event to update scroll position
  const handleScroll = (event) => {
    localStorage.setItem(pathname, event.target.scrollTop)
  }

  useEffect(() => {
    if (divRef.current) {
      //  console.log(divRef.current.scrollHeight)
      divRef.current.scrollTop = localStorage.getItem(pathname)
    }
  }, [pathname])

  return (
    <div id={id} ref={divRef} style={{ overflow: 'auto', height: '100%' }} onScroll={handleScroll}>
      {children}
    </div>
  )
}

export default PersistentScrollView
