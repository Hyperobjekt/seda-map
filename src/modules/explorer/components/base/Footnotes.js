import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(11),
    lineHeight: 1.25,
    color: theme.palette.grey[700],
    whiteSpace: 'normal',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    '& span': {
      marginRight: 4
    }
  }
}))

const Footnotes = ({
  footnotes,
  className,
  classes: overrides
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(
        'footnotes',
        classes.root,
        overrides.root,
        className
      )}>
      <Typography
        className={clsx(
          'footnotes__text',
          classes.text,
          overrides.text
        )}>
        {footnotes.map((v, i) => (
          <span key={'fn' + i}>{v}</span>
        ))}
      </Typography>
    </div>
  )
}

Footnotes.defaultProps = {
  classes: {},
  footnotes: []
}

Footnotes.propTypes = {
  classes: PropTypes.object,
  footnotes: PropTypes.array,
  className: PropTypes.string
}

export default Footnotes
