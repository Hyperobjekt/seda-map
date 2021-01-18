import React, { useEffect } from 'react'
import useStaticData from './useStaticData'

const DataLoader = () => {
  const loadDataForRegion = useStaticData(
    state => state.loadDataSet
  )
  const loaded = useStaticData(state => state.loaded)
  const timing = useStaticData(state => state.timing)

  const regions = ['states', 'counties', 'districts', 'schools']

  useEffect(() => {
    regions.forEach(r => loadDataForRegion(r))
  }, [loadDataForRegion, regions])

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
