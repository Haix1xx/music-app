import React from 'react'
//import css
import './Loader.css'

const Loader = () => {
  return (
    <div id="background">
      <div id="bee-container">
        <div id="bee">
          <div className="leg" id="right"></div>
          <div id="body">
            <div id="face"></div>
          </div>
          <div className="leg" id="left"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
