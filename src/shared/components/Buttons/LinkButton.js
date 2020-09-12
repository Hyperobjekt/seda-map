import React from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    cursor: 'pointer',
    padding: 0,
    margin: '0 auto',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    border: 0,
    background: 'none',
    '&:focus': {
      outline: 'none',
      textDecorationColor: theme.palette.secondary.main
    }
  }
}))

const LinkButton = ({ className, children, ...props }) => {
  const classes = useStyles()
  return (
    <button
      className={clsx(
        'button',
        'button--link',
        classes.root,
        className
      )}
      {...props}>
      {children}
    </button>
  )
}

export default LinkButton
