import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
}))

const PageFooter = ({
  children,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles(props)
  return (
    <footer
      className={clsx(classes.root, overrides.root)}
      {...props}>
      {children}
    </footer>
  )
}

PageFooter.propTypes = {
  classes: PropTypes.object
}
PageFooter.defaultProps = {
  classes: {}
}

export default PageFooter
