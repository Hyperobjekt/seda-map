import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const getAlign = align => {
  switch (align) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    default:
      return 'flex-start'
  }
}

const getJustify = justify => {
  switch (justify) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'between':
      return 'space-between'
    case 'around':
      return 'space-around'
    default:
      return 'flex-start'
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: props => props.direction,
    alignItems: props => getAlign(props.align),
    justifyContent: props => getJustify(props.justify),
    flexWrap: props => (props.wrap ? 'wrap' : 'nowrap')
  }
}))

const FlexStack = ({
  children,
  direction,
  justify,
  align,
  wrap,
  className,
  ...props
}) => {
  const classes = useStyles({ align, justify, direction, wrap })
  return (
    <div className={clsx(classes.root, className)} {...props}>
      {children}
    </div>
  )
}

FlexStack.defaultProps = {
  direction: 'row',
  justify: 'start',
  align: 'center',
  wrap: false
}

FlexStack.propTypes = {
  direction: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  wrap: PropTypes.bool
}

export default FlexStack
