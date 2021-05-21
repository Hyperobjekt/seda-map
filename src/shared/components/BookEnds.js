import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core'

const styles = () => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 'auto'
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
    width: 0,
    height: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column-reverse',
    '& $contentContainer': {
      transform: 'translateX(-50%) rotate(-90deg)'
    },
    '& $start': {
      transformOrigin: 'center left',
      transform: 'rotate(-90deg)'
    },
    '& $end': {
      transformOrigin: 'center right',
      transform: 'translateX(-100%) rotate(-90deg)'
    }
  }
})

/**
 * Shows a primary label at the given and optional start / end labels
 */
const BookEnds = ({
  startLabel,
  endLabel,
  vertical,
  children,
  className,
  classes,
  ...props
}) => {
  return (
    <div
      className={clsx('book-ends', className, classes.root, {
        [classes.vertical]: vertical
      })}
      {...props}>
      <div
        className={clsx(
          'book-end__labelContainer',
          'book-end__start',
          classes.labelContainer,
          classes.start
        )}>
        {startLabel}
      </div>
      <div
        className={clsx(
          'book-end__contentContainer',
          classes.contentContainer
        )}>
        {children}
      </div>
      <div
        className={clsx(
          'book-end__labelContainer',
          'book-end__end',
          classes.labelContainer,
          classes.end
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

export default withStyles(styles)(BookEnds)
