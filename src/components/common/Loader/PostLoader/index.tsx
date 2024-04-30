import React from 'react'
import './PostLoader.css'

const index = () => {
  return (
    <div className='post-loader-container'>
      <div className='typewriter'>
        <div className='slide'>
          <i></i>
        </div>
        <div className='paper'></div>
        <div className='keyboard'></div>
      </div>
    </div>
  )
}

export default index
