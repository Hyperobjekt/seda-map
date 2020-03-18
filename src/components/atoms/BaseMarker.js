import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    border: props => `2px solid ${props.color}`,
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)',
    boxShadow: `0 0 0 1.5px #fff, inset 0 0 0 1.5px #fff`
  }
}))

const BaseMarker = ({
  className,
  color,
  innerColor = 'transparent',
  children,
  style = {},
  ...props
}) => {
  const classes = useStyles({ color })
  return (
    <div
      className={clsx('marker', className, classes.root)}
      style={{
        background: innerColor,
        ...style
      }}
      {...props}>
      {children}
    </div>
  )
}

BaseMarker.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
}

export default BaseMarker
