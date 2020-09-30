import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Tooltip,
  makeStyles,
  Typography
} from '@material-ui/core'
import clsx from 'clsx'
import IndicatorIcon from '../Icons/IndicatorIcon'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  active: {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
      display: 'block',
      width: theme.spacing(6),
      height: theme.spacing(6),
      borderRadius: theme.spacing(6),
      background: theme.app.highlightColor,
      zIndex: -1
    }
  },
  label: {
    display: 'block'
  },
  startIcon: {
    display: 'block',
    margin: 0,
    height: theme.spacing(4),
    '& > svg.MuiSvgIcon-root': { fontSize: theme.spacing(4) },
    '& > svg.icon': { fontSize: theme.spacing(4) }
  },
  activeIcon: {
    color: theme.palette.primary.main,
    fill: theme.palette.primary.main
  }
}))

/**
 * Icon action buttons with tooltips, used in the condensed panel
 */
const IconLabelButton = ({
  icon,
  className,
  classes: overrides,
  children,
  active,
  tooltip,
  indicator,
  placement,
  ...props
}) => {
  const classes = useStyles()

  const startIcon = indicator ? (
    <IndicatorIcon indicator={indicator}>{icon}</IndicatorIcon>
  ) : (
    icon
  )

  const button = (
    <Button
      className={clsx(
        'icon-label-button',
        className,
        classes.root,
        {
          [classes.active]: active,
          'icon-label-button--active': active
        }
      )}
      classes={{
        label: clsx(classes.label, overrides.label),
        startIcon: clsx(classes.startIcon, overrides.startIcon, {
          [classes.activeIcon]: active
        })
      }}
      startIcon={startIcon}
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

IconLabelButton.propTypes = {
  icon: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  active: PropTypes.bool,
  tooltip: PropTypes.any,
  placement: PropTypes.string
}
IconLabelButton.defaultProps = {
  classes: {},
  placement: 'right'
}

export default IconLabelButton
