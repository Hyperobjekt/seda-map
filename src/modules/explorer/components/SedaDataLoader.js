import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useStaticData from './useStaticData'
import useDataOptions from '../hooks/useDataOptions'
import { autoType } from 'd3-dsv'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

/** Parser for data, ensures ID stays a string */
const SEDA_PARSER = ({ id, ...rest }) => {
  return { id, ...autoType(rest) }
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.87)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

/**
 * Handles loading of all data within the app
 */
const SedaDataLoader = ({ className, ...props }) => {
  const loadDataForRegion = useStaticData(
    state => state.loadDataSet
  )
  const loaded = useStaticData(state => state.loaded)
  const loading = useStaticData(state => state.loading)
  const region = useDataOptions(state => state.region)
  const classes = useStyles()
  useEffect(() => {
    if (loaded.indexOf(region) === -1)
      loadDataForRegion(region, SEDA_PARSER)
  }, [loaded, loadDataForRegion, region])

  return (
    <div
      className={clsx('data-loader', classes.root, className)}
      {...props}>
      <p>Loading {loading.join(', ')}</p>
    </div>
  )
}

SedaDataLoader.propTypes = {
  className: PropTypes.string
}

export default SedaDataLoader
