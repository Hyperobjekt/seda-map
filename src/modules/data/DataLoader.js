import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useStaticData from './useStaticData'
import { autoType } from 'd3-dsv'

const SEDA_PARSER = ({ id, ...rest }) => {
  return {
    id,
    ...autoType(rest)
  }
}

const DataLoader = props => {
  const loadDataForRegion = useStaticData(
    state => state.loadDataSet
  )
  const loaded = useStaticData(state => state.loaded)
  const timing = useStaticData(state => state.timing)

  const regions = ['states', 'counties', 'districts', 'schools']

  useEffect(() => {
    regions.forEach(r => loadDataForRegion(r, SEDA_PARSER))
  }, [loadDataForRegion])

  return (
    <ul>
      {regions.map(r => (
        <li key={r}>
          <span>{r}</span>
          <span>
            (
            {loaded.indexOf(r) > -1
              ? `loaded in ${Math.round(timing[r])}ms`
              : 'loading...'}
            )
          </span>
        </li>
      ))}
    </ul>
  )
}

DataLoader.propTypes = {}

export default DataLoader
