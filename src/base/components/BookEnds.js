import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  makeStyles,
  Button,
  Typography
} from '@material-ui/core'

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

const BookEnds = ({
  startLabel,
  endLabel,
  startIcon,
  endIcon,
  onStartClick,
  onEndClick,
  vertical,
  midPosition,
  children,
  className,
  classes: overrides = {},
  ...props
}) => {
  const classes = useStyles({ vertical })
  const Tag = onStartClick || onEndClick ? Button : 'div'
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
      <Tag
        className={clsx(
          'book-end__labelContainer',
          'book-end__start',
          classes.labelContainer,
          classes.start,
          overrides.labelContainer,
          overrides.start
        )}
        onClick={onStartClick}>
        {startIcon}
        <Typography variant="body2">{startLabel}</Typography>
      </Tag>
      <div
        className={clsx(
          'book-end__contentContainer',
          classes.contentContainer,
          overrides.contentContainer
        )}>
        {children}
      </div>
      <Tag
        className={clsx(
          'book-end__labelContainer',
          'book-end__end',
          classes.labelContainer,
          classes.end,
          overrides.labelContainer,
          overrides.end
        )}
        onClick={onEndClick}>
        <Typography variant="body2">{endLabel}</Typography>
        {endIcon}
      </Tag>
    </div>
  )
}

BookEnds.propTypes = {
  startLabel: PropTypes.any,
  endLabel: PropTypes.any,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onStartClick: PropTypes.func,
  onEndClick: PropTypes.func,
  vertical: PropTypes.bool,
  midPosition: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object
}

export default BookEnds
