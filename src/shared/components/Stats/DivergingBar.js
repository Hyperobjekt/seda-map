import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    position: 'relative',
    minWidth: 80,
    minHeight: 8
  },
  above: {
    "& $bar": {
      background: theme.app.aboveColor
    }
  },
  below: {
    "& $bar": {
      background: theme.app.belowColor
    }
  },
  invert: {
    "&$above $bar": {
      background: theme.app.belowColor
    },
    "&$below $bar": {
      background: theme.app.aboveColor
    }
  },
  track: {
    position: 'absolute',
    height: 1,
    width: '100%',
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: theme.palette.divider
  },
  tick: {
    position: 'absolute',
    width: 2,
    marginLeft: -1,
    left: '50%',
    top: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: theme.palette.grey[500],
    zIndex:5
  },
  bar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -2,
    height: 5,
    color: theme.palette.grey[500]
  }
})

/**
 * A diverging bar indicator with a bar stemming from the midpoint
 */
const DivergingBar = ({
  value,
  invert,
  classes,
  className,
  ...props
}) => {
  const width = Math.abs((100 * value) / 2)
  const above = value > 0
  const below = value < 0
  const barStyle = {
    width: `${width}%`,
    transform: below ? 'translateX(-100%)' : 'none',
  }
  return (
    <div
      className={clsx(
        classes.root,
        { [classes.above]: above, [classes.below]: below, [classes.invert]: invert },
        className
      )}
      {...props}>
      <div className={classes.track} />
      <div className={classes.tick} />
      <div className={classes.bar} style={barStyle} />
    </div>
  )
}


DivergingBar.propTypes = {
  /** numeric value between -1 and 1 */
  value: PropTypes.number
}

export default withStyles(styles)(DivergingBar)
