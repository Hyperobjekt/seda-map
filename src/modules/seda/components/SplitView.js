import React, { useRef, useState } from 'react'
import { useTheme, makeStyles } from '@material-ui/core'
import SedaMap from './SedaMap'
import { Scatterplot } from './scatterplot'
import clsx from 'clsx'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import SedaMapLegend from './SedaMapLegend'

const getSplitRatio = (containerRef, dividerRef) => {
  const containerEl = containerRef.current
  const dividerEl = dividerRef.current
  if (!containerEl || !dividerEl) return 0.5
  const contRect = containerEl.getBoundingClientRect()
  const divRect = dividerEl.getBoundingClientRect()
  console.log(contRect, divRect)
  const midPoint = divRect.left + divRect.width / 2
  const ratio =
    (midPoint - contRect.left) / (contRect.right - contRect.left)
  console.log(midPoint, contRect.left, contRect.right, ratio)
  return ratio
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  area: {
    height: '100%',
    display: 'flex',
    transition: theme.transitions.create(
      ['width', 'transform'],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }
    )
  },
  side: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  left: {
    width: props =>
      props.view === 'split'
        ? props.splitRatio * 100 + '%'
        : '50%'
  },
  right: {
    width: props =>
      props.view === 'split'
        ? (1 - props.splitRatio) * 100 + '%'
        : '50%'
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: props => props.splitRatio * 100 + '%',
    marginLeft: -4,
    width: 8,
    height: '100%',
    background: '#fff',
    border: '1px solid transparent',
    borderLeftColor: theme.palette.divider,
    borderRightColor: theme.palette.divider,
    cursor: 'ew-resize',
    zIndex: 100
  },
  blocker: {
    ...theme.mixins.fillSpace,
    background: '#fff'
  }
}))

export const SplitView = ({
  children,
  view,
  splitRatio: initialSplit = 0.333,
  minWidth = 360,
  ...props
}) => {
  const rootRef = useRef(null)
  const dividerRef = useRef(null)
  const [splitRatio, setSplitRatio] = useState(initialSplit)
  const [position, setPosition] = useState(0)
  const [resizing, setResizing] = useState(false)
  const blockerProps = useSpring({
    opacity: resizing ? 0.666 : 0,
    zIndex: 10,
    pointerEvents: resizing ? 'all' : 'none'
  })

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(
    ({ down, first, last, initial, movement: [mx, my] }) => {
      setPosition(mx)
      if (first) {
        setResizing(true)
      }
      if (last) {
        const newRatio = getSplitRatio(rootRef, dividerRef)
        setSplitRatio(newRatio)
        setPosition(0)
        setResizing(false)
      }
    }
  )

  const classes = useStyles({ splitRatio, view })
  return (
    <div
      ref={rootRef}
      className={clsx('split-view', classes.root)}
      {...props}>
      <div
        className={clsx('split-view__area', classes.area)}
        style={{
          width: view === 'split' ? '100%' : '200%',
          transform:
            view === 'right'
              ? 'translateX(-50%)'
              : 'translateX(0)'
        }}>
        <div
          className={clsx(
            'split-view__side',
            'split-view__side--left',
            classes.side,
            classes.left
          )}>
          <SedaMap />
        </div>
        <div
          className={clsx(
            'split-view__side',
            'split-view__side--right',
            classes.side,
            classes.right
          )}>
          <Scatterplot />
        </div>
      </div>
      <animated.div
        className={classes.blocker}
        style={blockerProps}
      />
      {view === 'split' && (
        <animated.div
          ref={dividerRef}
          {...bind()}
          className={clsx(
            'split-view__divider',
            classes.divider
          )}
          style={{ transform: `translateX(${position}px)` }}
        />
      )}
    </div>
  )
}
