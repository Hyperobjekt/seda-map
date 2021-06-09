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

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: props =>
      props.horizontal ? 'row' : 'column',
    alignItems: props => getAlign(props.align),
    justifyContent: props => getJustify(props.justify),
    flexWrap: props => (props.wrap ? 'wrap' : 'nowrap'),
    '& > * + *': {
      marginLeft: props =>
        props.horizontal ? props.margin : undefined,
      marginTop: props =>
        !props.horizontal ? props.margin : undefined
    }
  }
}))
/**
 * Layout helper for flex box
 */
const Stack = ({
  children,
  horizontal,
  justify,
  align,
  wrap,
  margin = 8,
  className,
  ...props
}) => {
  const classes = useStyles({
    align,
    justify,
    horizontal,
    wrap,
    margin
  })
  return (
    <div
      className={clsx('stack', classes.root, className)}
      {...props}>
      {children}
    </div>
  )
}

Stack.defaultProps = {
  horizontal: false,
  justify: 'start',
  align: 'center',
  wrap: false
}

Stack.propTypes = {
  /** stacks horizontal when true  */
  horizontal: PropTypes.bool,
  /** how to justify child items (e.g. `start`, `center`, `end`, `between`, `around`) */
  justify: PropTypes.string,
  /** how to align child items (`start`, `center`, `end`) */
  align: PropTypes.string,
  /** wraps items when true */
  wrap: PropTypes.bool
}

export default Stack
