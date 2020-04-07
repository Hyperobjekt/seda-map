import React from 'react'
import PropTypes from 'prop-types'
import { Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useTooltipStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5)
  },
  primary: {
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(14)
  },
  secondary: {
    color: theme.app.altDarkText,
    textTransform: 'capitalize',
    fontSize: theme.typography.pxToRem(12)
  },
  hint: {
    ...theme.mixins.hint,
    paddingTop: theme.spacing(1)
  }
}))

const DetailedTooltip = ({
  primary,
  secondary,
  hint,
  ...props
}) => {
  const classes = useTooltipStyles()
  return (
    <div
      className={clsx('panel-tooltip', classes.root)}
      {...props}>
      {primary && (
        <Typography className={classes.primary} variant="body1">
          {primary}
        </Typography>
      )}
      {secondary && (
        <Typography
          className={classes.secondary}
          variant="body2">
          {secondary}
        </Typography>
      )}
      {hint && (
        <Typography className={classes.hint} variant="caption">
          {hint}
        </Typography>
      )}
    </div>
  )
}

DetailedTooltip.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  hint: PropTypes.string
}

export default DetailedTooltip
