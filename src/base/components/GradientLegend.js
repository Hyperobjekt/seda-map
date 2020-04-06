import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import BookEnds from './BookEnds'
import { makeStyles, Typography } from '@material-ui/core'
import { animated, useSpring } from 'react-spring'

/**
 * Returns a CSS gradient string with the given colors
 * to match the provided value range and color distribution
 * range.
 * @param {*} param0 configuration for gradient string
 */
const getGradient = ({
  colors,
  labelRange,
  colorRange,
  vertical = false
}) => {
  const legendExtent = labelRange[1] - labelRange[0] // 6
  const colorExtent = colorRange[1] - colorRange[0] // 7
  // size of the color range relative to the legend range
  const colorRangePercent = (100 * colorExtent) / legendExtent // 116.666%
  const steps = colors.length - 1
  const colorStepSize = colorRangePercent / steps // 16.666665714285714%
  const colorStartPercent =
    (100 * (colorRange[0] - labelRange[0])) /
    (labelRange[1] - labelRange[0])
  // 100 * -1 / 6 = -16.6666%
  const colorStepsString = colors
    .map(
      (c, i) =>
        c + ' ' + (colorStartPercent + colorStepSize * i) + '%'
    )
    .join(',')
  return vertical
    ? 'linear-gradient(to top, ' + colorStepsString + ')'
    : 'linear-gradient(to right, ' + colorStepsString + ')'
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  bar: {
    position: 'relative',
    height: theme.spacing(1),
    width: '100%'
  },
  marker: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 6,
    marginLeft: -3,
    background: theme.palette.secondary.main,
    border: `2px solid ${theme.palette.common.white}`
  },
  ticks: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: 2
  },
  tick: {
    width: 1,
    height: theme.spacing(0.5),
    background: theme.palette.divider
  },
  midTick: {
    position: 'absolute',
    top: 0,
    transform: 'translateX(-50%)'
  },

  labels: {
    color: theme.palette.text.secondary
  },
  startLabel: {
    '& .MuiTypography-root': {
      fontSize: 11,
      lineHeight: '12px'
    },
    transform: 'translateX(-50%)'
  },
  midLabel: {
    fontSize: 11,
    lineHeight: '12px'
  },
  endLabel: {
    '& .MuiTypography-root': {
      fontSize: 11,
      lineHeight: '12px'
    },
    transform: 'translateX(50%)'
  }
}))

const GradientLegend = ({
  labelRange,
  colorRange,
  colors,
  ticks,
  midLabel,
  midPosition,
  markerPosition,
  labelFormatter,
  classes: overrides,
  className,
  ...props
}) => {
  const classes = useStyles()
  const markerStyle = useSpring({
    left: markerPosition
      ? `${markerPosition * 100}%`
      : midPosition
      ? `${midPosition * 100}%`
      : '50%',
    opacity: markerPosition ? 1 : 0
  })
  const barStyle = {
    background: getGradient({
      colors,
      labelRange,
      colorRange
    })
  }
  const tickArray = ticks ? ['min', 'mid', 'max'] : []
  return (
    <div
      className={clsx(
        'gradient-legend',
        className,
        classes.root,
        overrides.root
      )}>
      {/* GRADIENT BAR */}
      <div
        className={clsx(
          'gradient-legend__bar',
          classes.bar,
          overrides.bar
        )}
        style={barStyle}>
        {/* HOVER MARKER */}
        <animated.div
          className={clsx(
            'gradient-legend__marker',
            classes.marker,
            overrides.marker
          )}
          style={markerStyle}
        />
        {/* END HOVER MARKER */}
      </div>
      {/* END GRADIENT BAR */}

      {/* TICKS */}
      {ticks && (
        <div
          className={clsx(
            'gradient-legend__ticks',
            classes.ticks,
            overrides.ticks
          )}>
          {tickArray.map((v, i) => (
            <div
              key={`tick${i}`}
              className={clsx(
                'gradient-legend__tick',
                'gradient-legend__tick--' + v,
                classes.tick,
                overrides.tick,
                { [classes.midTick]: v === 'mid' && midPosition }
              )}
              style={{
                left:
                  v === 'mid' && midPosition
                    ? midPosition * 100 + '%'
                    : undefined
              }}
            />
          ))}
        </div>
      )}
      {/* END TICKS */}

      {/* LABELS */}
      <BookEnds
        className={clsx(
          'gradient-legend__labels',
          classes.labels
        )}
        classes={{
          start: classes.startLabel,
          end: classes.endLabel
        }}
        startLabel={labelFormatter(labelRange[0])}
        endLabel={labelFormatter(labelRange[1])}>
        <Typography
          variant="caption"
          className={clsx(
            'gradient-legend__mid-label',
            classes.midLabel,
            overrides.midLabel,
            {
              [classes.midTick]: Boolean(midPosition)
            }
          )}
          style={{
            left: Boolean(midPosition)
              ? midPosition * 100 + '%'
              : undefined
          }}>
          {midLabel}
        </Typography>
      </BookEnds>
      {/* END LABELS */}
    </div>
  )
}

GradientLegend.defaultProps = {
  classes: {},
  ticks: true,
  labelRange: [-1, 1],
  labelFormatter: v => v,
  colorRange: [-1, 1],
  colors: ['#c66', '#ccc', '#6c6']
}

GradientLegend.propTypes = {
  /** Rang of values ([min, max]) */
  labelRange: PropTypes.array,
  /** Function to format labels */
  labelFormatter: PropTypes.func,
  /** Range to distribute colors over ([min, max]) */
  colorRange: PropTypes.array,
  /** Array of colors  */
  colors: PropTypes.array,
  /** Number of ticks to show below the gradient */
  ticks: PropTypes.bool,
  /** Label for the middle of the gradient bar */
  midLabel: PropTypes.string,
  /** Position for a marker on the gradient */
  markerPosition: PropTypes.number,
  /** Object of classnames for styling the component */
  classes: PropTypes.object,
  /** Classname for the root element of the component */
  className: PropTypes.string
}

export default GradientLegend
