import React from 'react'
import { Button, Tooltip } from '@material-ui/core'

const HintButton = ({ ButtonProps, ...props }) => {
  return (
    <Tooltip {...props}>
      <Button {...ButtonProps} />
    </Tooltip>
  )
}

export default HintButton
