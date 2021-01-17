import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  CircularProgress,
  Typography,
  withStyles
} from '@material-ui/core'
import useDataLoading from '../hooks/useDataLoading'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(8),
    right: theme.spacing(3),
    margin: 'auto',
    borderRadius: `0 0 3px 3px`,
    boxShadow: `var(--shadow1)`,
    background: 'rgba(255, 255, 255, 0.87)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: theme.spacing(1),
    transform: `translate3d(0, -40px, 0)`,
    opacity: 0,
    transition: theme.transitions.create([
      'opacity',
      'transform'
    ])
  },
  loading: {
    transform: `translate3d(0, 0, 0)`,
    opacity: 1
  },
  spinner: {
    width: theme.spacing(2) + 'px!important',
    height: theme.spacing(2) + 'px!important',
    marginRight: theme.spacing(1)
  },
  text: {}
})

/**
 * Handles loading of all data within the app
 */
const SedaDataLoader = ({ className, classes, ...props }) => {
  const [loading, , isLoading] = useDataLoading()
  return (
    <div
      className={clsx(
        'data-loader',
        classes.root,
        { [classes.loading]: isLoading },
        className
      )}
      {...props}>
      {Boolean(loading.length) && (
        <CircularProgress className={classes.spinner} />
      )}
      <Typography variant="body1">
        {isLoading
          ? 'Loading ' + loading[0]
          : 'Loading complete'}
      </Typography>
    </div>
  )
}

SedaDataLoader.propTypes = {
  className: PropTypes.string
}

export default withStyles(styles)(SedaDataLoader)
