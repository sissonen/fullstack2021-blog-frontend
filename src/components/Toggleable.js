import React, { useState, useImperativeHandle } from 'react'

const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideStyle = { display: visible ? 'none' : 'block' }
  const showStyle = { display: visible ? 'block' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideStyle}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showStyle}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )

})

Toggleable.displayName = 'Toggleable'

export default Toggleable
