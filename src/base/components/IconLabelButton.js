import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Tooltip,
  makeStyles,
  Typography
} from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {},
  label: {
    display: 'block'
  },
  startIcon: {
    display: 'block',
    margin: 0,
    height: 32,
    '& > svg.MuiSvgIcon-root': { fontSize: 32 }
  }
}))

const IconLabelButton = ({
  icon,
  classes: overrides,
  children,
  tooltip,
  placement,
  ...props
}) => {
  const classes = useStyles()

  const button = (
    <Button
      classes={{
        label: clsx(classes.label, overrides.label),
        startIcon: clsx(classes.startIcon, overrides.startIcon)
      }}
      startIcon={icon}
      {...props}>
      <Typography variant="srOnly">{tooltip}</Typography>
    </Button>
  )
  return tooltip ? (
    <Tooltip title={tooltip} placement={placement} arrow>
      {button}
    </Tooltip>
  ) : (
    button
  )
}

IconLabelButton.propTypes = {}
IconLabelButton.defaultProps = {
  classes: {},
  placement: 'right'
}

export default IconLabelButton
