import React from 'react'
const Info = (info) => {
  const infoStyle = {
    padding: 10,
    border: '3px solid green',
    borderRadius: 5,
    margin: 10,
  }
  const errorStyle = {
    padding: 10,
    border: '3px solid red',
    borderRadius: 5,
    margin: 10,
  }
  if (info.info !== null) {
    let style = infoStyle
    if (info.info.level === 'error') {
      style = errorStyle
    }
    return (
      <div style={style}>
        {info.info.msg}
      </div>
    )
  }
  return null
}

export default Info
