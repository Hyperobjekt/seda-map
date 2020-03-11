import React from 'react'
import classNames from 'classnames'
import { getLang } from '../../shared/selectors/lang'
import { Button } from '@material-ui/core'

const HelpButton = ({ className, ...props }) => {
  return (
    <Button
      id="helpToggle"
      className={classNames('button--help', className)}
      color="secondary"
      variant="contained"
      size="small"
      {...props}>
      {getLang('HELP_BUTTON')}
    </Button>
  )
}

export default HelpButton
