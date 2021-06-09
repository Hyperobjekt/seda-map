import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative'
  }
}))

/**
 * The main body of the page
 */
const PageBody = ({
  children,
  classes: overrides,
  className,
  ...props
}) => {
  const classes = useStyles(props)
  return (
    <main
      className={clsx(
        'page__body',
        classes.root,
        overrides.root,
        className
      )}
      {...props}>
      {children}
    </main>
  )
}

PageBody.propTypes = {
  /** Class names for the page body elements */
  classes: PropTypes.object
}
PageBody.defaultProps = {
  classes: {}
}

export default PageBody
