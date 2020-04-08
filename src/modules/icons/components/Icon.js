import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useIconStyles = makeStyles(theme => ({
  root: {
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    '& .filled': {
      opacity: 0
    }
  }
}))

const Icon = ({
  color,
  size = 24,
  className,
  children,
  ...props
}) => {
  const classes = useIconStyles()
  return (
    <svg
      className={clsx('icon', classes.root, className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      {children}
    </svg>
  )
}

export default Icon
