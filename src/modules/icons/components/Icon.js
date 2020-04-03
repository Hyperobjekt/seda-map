import React from 'react'
import clsx from 'clsx'
import useIconStyles from '../hooks/useIconStyles'

const Icon = ({ color, size = 24, children, ...props }) => {
  const classes = useIconStyles()
  return (
    <svg
      className={clsx('icon', classes.root)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      {children}
    </svg>
  )
}

export default Icon
