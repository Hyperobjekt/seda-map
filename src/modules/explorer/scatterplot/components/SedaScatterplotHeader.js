import React from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { getChartTitle, getFootnotes } from '../lang'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    position: 'absolute',
    left: theme.spacing(0),
    top: theme.spacing(-6),
    right: 0,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.25,
    whiteSpace: 'normal',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  },
  footnote: {
    marginTop: theme.spacing(0.5),
    whiteSpace: 'normal'
  }
})

const SedaScatterplotHeader = ({
  classes,
  className,
  xVar,
  yVar,
  region,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'scatterplot__header',
        classes.root,
        className
      )}
      {...props}>
      <Typography variant="h6" className={classes.title}>
        {getChartTitle(xVar, yVar, region)}{' '}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        className={clsx('footnotes__text', classes.footnote)}>
        {getFootnotes(xVar, yVar, region).map((v, i) => (
          <span key={'fn' + i}>{v} </span>
        ))}
      </Typography>
      {children}
    </div>
  )
}

SedaScatterplotHeader.propTypes = {}

export default withStyles(styles)(SedaScatterplotHeader)
