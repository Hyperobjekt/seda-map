import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

const getSplitRatio = (containerRef, dividerRef) => {
  const containerEl = containerRef.current
  const dividerEl = dividerRef.current
  if (!containerEl || !dividerEl) return 0.5
  const contRect = containerEl.getBoundingClientRect()
  const divRect = dividerEl.getBoundingClientRect()
  const midPoint = divRect.left + divRect.width / 2
  const ratio =
    (midPoint - contRect.left) / (contRect.right - contRect.left)
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
    height: '100%',
    overflow: 'auto'
  },
  component: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minWidth: 320
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

/**
 * A resizable side by side display
 */
export default function SplitView({
  LeftComponent,
  RightComponent,
  view,
  splitRatio: initialSplit = 0.5,
  ...props
}) {
  const rootRef = useRef(null)
  const dividerRef = useRef(null)
  const [splitRatio, setSplitRatio] = useState(initialSplit)
  const [position, setPosition] = useState(0)
  const [resizing, setResizing] = useState(false)
  const blockerProps = useSpring({
    opacity: resizing ? 0.666 : 0,
    zIndex: 10,
    pointerEvents: 'none'
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
    },
    {
      eventOptions: {
        capture: true
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
          <div
            className={clsx(
              'split-view__component',
              classes.component
            )}>
            {LeftComponent}
          </div>
        </div>
        <div
          className={clsx(
            'split-view__side',
            'split-view__side--right',
            classes.side,
            classes.right
          )}>
          <div
            className={clsx(
              'split-view__component',
              classes.component
            )}>
            {RightComponent}
          </div>
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

SplitView.propTypes = {
  /** component for the left side of the view */
  LeftComponent: PropTypes.node,
  /** component for the right side of the view */
  RightComponent: PropTypes.node,
  /** how the split view should display (`left`, `right`, `split`) */
  view: PropTypes.string,
  /** size ratio for the split view */
  splitRatio: PropTypes.number
}
