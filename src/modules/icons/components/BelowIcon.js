import React from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
    fontSize: 24,
    fill: 'currentColor'
  }
}))

const BelowIcon = ({ color, className, ...props }) => {
  const classes = useStyles()
  return (
    <svg
      className={clsx('icon', classes.root, className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M18 14V10H6V14H18Z" fill={color} />
    </svg>
  )
}

export default BelowIcon
