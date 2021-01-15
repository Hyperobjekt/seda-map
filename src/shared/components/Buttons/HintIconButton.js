import React from 'react'
import {
  IconButton,
  Tooltip,
  withStyles
} from '@material-ui/core'
import InfoIcon from '../../../modules/icons/components/InfoIcon'
import clsx from 'clsx'

const styles = theme => ({
  button: {
    marginTop: -1,
    padding: 0,
    color: theme.palette.grey[500],
    borderRadius: '100%'
  },
  icon: {
    fontSize: theme.spacing(2)
  }
})

const HintIconButton = ({
  title,
  placement,
  size,
  TooltipProps,
  classes,
  className,
  ...props
}) => {
  return (
    <Tooltip
      arrow
      title={title}
      placement={placement}
      {...TooltipProps}>
      <IconButton
        className={clsx(classes.button, className)}
        size={size}
        {...props}>
        <InfoIcon className={classes.icon} />
      </IconButton>
    </Tooltip>
  )
}

export default withStyles(styles)(HintIconButton)
