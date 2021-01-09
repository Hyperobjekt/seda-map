import React from 'react'
import { Typography, withStyles } from '@material-ui/core'
import clsx from 'clsx'

const styles = (theme) => ({
  root: { display: 'block', padding: theme.spacing(2) }
})

const PanelDescription = ({classes, className, ...props}) => {
  return (
    <Typography
      className={clsx(classes.root, className)}
      variant="caption" {...props} />
  )
}

export default withStyles(styles)(PanelDescription)
