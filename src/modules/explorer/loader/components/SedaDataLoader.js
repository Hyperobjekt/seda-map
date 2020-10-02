import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'
import useDataLoading from '../hooks/useDataLoading'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.87)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  }
}))

/**
 * Handles loading of all data within the app
 */
const SedaDataLoader = ({ className, ...props }) => {
  const classes = useStyles()
  const [loading] = useDataLoading()

  return loading.length > 0 ? (
    <div
      className={clsx('data-loader', classes.root, className)}
      {...props}>
      <p>Loading {loading.join(', ')}</p>
    </div>
  ) : null
}

SedaDataLoader.propTypes = {
  className: PropTypes.string
}

export default SedaDataLoader
