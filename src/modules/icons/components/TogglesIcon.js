import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

const TogglesIcon = props => {
  return (
    <SvgIcon {...props}>
      <line x1="16.425" y1="1.85773e-08" x2="16.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
      <line x1="9.425" y1="1.85773e-08" x2="9.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
      <line x1="2.425" y1="1.85773e-08" x2="2.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
      <circle cx="16.5" cy="6.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
      <circle cx="9.5" cy="14.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
      <circle cx="2.5" cy="5.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
    </SvgIcon>
  )
}

export default TogglesIcon
