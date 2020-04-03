import React from 'react'
import { IconButton } from '@material-ui/core'
import CloseIcon from '../../modules/icons/components/CloseIcon'

const CloseButton = ({ children, ...props }) => {
  return (
    <IconButton
      className="button--close"
      size="small"
      aria-label="close"
      {...props}>
      <CloseIcon />
      {children}
    </IconButton>
  )
}

export default CloseButton
