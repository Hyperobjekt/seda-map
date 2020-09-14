import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: props =>
      props.vertical ? 'column-reverse' : 'row',
    width: props => (props.vertical ? 0 : '100%'),
    height: props => (props.vertical ? '100%' : 'auto')
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  contentContainer: {},
  start: {},
  end: {},
  vertical: {
    alignItems: 'flex-start',
    '& .book-end__contentContainer': {
      transform: 'translateX(-50%) rotate(-90deg)'
    },
    '& .book-end__start': {
      transformOrigin: 'center left',
      transform: 'rotate(-90deg)'
    },
    '& .book-end__end': {
      transformOrigin: 'center right',
      transform: 'translateX(-100%) rotate(-90deg)'
    }
  }
}))

/**
 * Shows a primary label at the given and optional start / end labels
 */
const BookEnds = ({
  startLabel,
  endLabel,
  vertical,
  children,
  className,
  classes: overrides = {},
  ...props
}) => {
  const classes = useStyles({ vertical })
  return (
    <div
      className={clsx(
        'book-ends',
        className,
        classes.root,
        overrides.root,
        { [classes.vertical]: vertical }
      )}
      {...props}>
      <div
        className={clsx(
          'book-end__labelContainer',
          'book-end__start',
          classes.labelContainer,
          classes.start,
          overrides.labelContainer,
          overrides.start
        )}>
        {startLabel}
      </div>
      <div
        className={clsx(
          'book-end__contentContainer',
          classes.contentContainer,
          overrides.contentContainer
        )}>
        {children}
      </div>
      <div
        className={clsx(
          'book-end__labelContainer',
          'book-end__end',
          classes.labelContainer,
          classes.end,
          overrides.labelContainer,
          overrides.end
        )}>
        {endLabel}
      </div>
    </div>
  )
}

BookEnds.propTypes = {
  startLabel: PropTypes.any,
  endLabel: PropTypes.any,
  vertical: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.object
}

export default BookEnds
