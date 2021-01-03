import React from 'react'
import PropTypes from 'prop-types'
import {
  ListItem,
  ListItemAvatar,
  Typography,
  withStyles
} from '@material-ui/core'
import {
  AboveIcon,
  BelowIcon,
  EqualIcon,
  RightIcon
} from '../../../icons'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    padding: theme.spacing(0.5, 2)
  },
  high: {
    '& $icon': {
      color: theme.app.aboveColor
    }
  },
  low: {
    '& $icon': {
      color: theme.app.belowColor
    }
  },
  mid: {
    '& $icon': {
      color: theme.palette.grey[500]
    }
  },
  avatar: {
    minWidth: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: theme.spacing(2),
    marginRight: 6 // align icon with section below
  },
  text: {
    fontSize: theme.typography.pxToRem(12)
  }
})

const getIndicatorIcon = type => {
  switch (type) {
    case 'HIGH':
    case 'VERY_HIGH':
    case 'ULTRA_HIGH':
      return AboveIcon
    case 'LOW':
    case 'VERY_LOW':
    case 'ULTRA_LOW':
      return BelowIcon
    case 'MID':
      return EqualIcon
    default:
      return RightIcon
  }
}

const getIndicatorClassName = type => {
  switch (type) {
    case 'HIGH':
    case 'VERY_HIGH':
    case 'ULTRA_HIGH':
      return 'high'
    case 'LOW':
    case 'VERY_LOW':
    case 'ULTRA_LOW':
      return 'low'
    default:
      return 'mid'
  }
}

const LocationSummaryListItem = ({
  classes,
  className,
  indicator,
  description,
  ...props
}) => {
  const Icon = getIndicatorIcon(indicator)
  const indicatorClass = getIndicatorClassName(indicator)
  return (
    <ListItem
      className={clsx(
        classes.root,
        classes[indicatorClass],
        className
      )}
      {...props}>
      <ListItemAvatar className={classes.avatar}>
        <Icon className={classes.icon} />
      </ListItemAvatar>
      <Typography
        className={classes.text}
        variant="body2"
        color="textPrimary"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </ListItem>
  )
}

LocationSummaryListItem.propTypes = {}

export default withStyles(styles)(LocationSummaryListItem)
