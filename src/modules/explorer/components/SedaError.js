import React from 'react'
import PropTypes from 'prop-types'
import { useError, useErrorVisibility } from '../hooks'
import { useSpring, animated } from 'react-spring'
import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'
import { CloseIcon } from '../../icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    background: '#fee',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.error.main}`
  },
  text: {
    color: theme.palette.error.dark
  },
  icon: {
    marginLeft: theme.spacing(3)
  }
}))

const ErrorMessage = ({
  className,
  show,
  message,
  style: initialStyle,
  ...props
}) => {
  const classes = useStyles()
  const style = useSpring({
    transform:
      show && message ? `translateY(0)` : `translateY(100%)`,
    opacity: show && message ? 1 : 0
  })
  return (
    <animated.div
      className={clsx('error', classes.root, className)}
      style={{ ...style, ...initialStyle }}
      {...props}>
      <Typography
        className={classes.text}
        variant="body1"
        component="span">
        {message}
      </Typography>
      <CloseIcon className={classes.icon} />
    </animated.div>
  )
}

ErrorMessage.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool,
  message: PropTypes.string
}

const SedaError = ({ ...props }) => {
  const [error] = useError()
  const [showError, setShowError] = useErrorVisibility()
  return (
    <ErrorMessage
      show={showError}
      message={error}
      onClick={() => setShowError(null)}
      {...props}
    />
  )
}

export default SedaError
