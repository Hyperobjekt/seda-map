import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Marker from '../../../base/components/Marker'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const hasVal = val => val || val === 0

const useStyles = makeStyles(theme => ({
  root: theme.mixins.fillSpace,
  marker: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'all',
    '&:hover': {
      borderColor: theme.palette.secondary.main
    },
    '&:hover .marker__label': {
      color: theme.palette.secondary.main
    }
  }
}))

const ScatterplotMarker = ({
  classes: overrides,
  x,
  y,
  size,
  ...props
}) => {
  const classes = useStyles()
  return hasVal(x) && hasVal(y) ? (
    <div
      className={clsx(
        'scatterplot__marker--wrapper',
        classes.root,
        overrides.root
      )}
      style={{ transform: `translate(${x}, ${y})` }}>
      <Marker
        className={clsx(
          'scatterplot__marker',
          classes.marker,
          overrides.marker
        )}
        style={{
          width: size + 'px',
          height: size + 'px'
        }}
        {...props}
      />
    </div>
  ) : null
}

ScatterplotMarker.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  x: PropTypes.string,
  y: PropTypes.string,
  size: PropTypes.number
}

ScatterplotMarker.defaultProps = {
  classes: {}
}

export default ScatterplotMarker
