import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import ScatterplotMarker from './ScatterplotMarker'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  hoverMarker: {
    pointerEvents: 'none'
  }
}))

const ScatterplotOverlay = ({
  className,
  hoveredCircle,
  otherCircles,
  onHover,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(
        'scatterplot__markers',
        classes.root,
        className
      )}
      {...props}>
      {hoveredCircle && (
        <ScatterplotMarker
          x={hoveredCircle.x}
          y={hoveredCircle.y}
          size={hoveredCircle.z}
          zIndex={10}
          color={hoveredCircle.outerColor}
          innerColor={hoveredCircle.innerColor}
          classes={{ marker: classes.hoverMarker }}
        />
      )}
      {otherCircles
        .sort((a, b) => (a.z > b.z ? -1 : 1))
        .map((c, i) => (
          <ScatterplotMarker
            key={c.id}
            x={c.x}
            y={c.y}
            size={c.z}
            label={c.label}
            zIndex={i + 1}
            color={c.outerColor}
            innerColor={c.innerColor}
            onMouseMove={e => onHover(c, e)}
            onMouseLeave={e => onHover(null, e)}
          />
        ))}
    </div>
  )
}

export default ScatterplotOverlay
