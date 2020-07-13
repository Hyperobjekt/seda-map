import React from 'react'
import PropTypes from 'prop-types'
import useStaticData from './useStaticData'
import { Button } from '@material-ui/core'
import { applyFilters } from './filter'
import { autoType } from 'd3-dsv'

const filters = [
  ['startsWith', 'id', '06'],
  ['sort', 'all_sz', 'asc'],
  ['limit', 100]
]

const SEDA_PARSER = ({ id, ...rest }) => {
  return {
    id,
    ...autoType(rest)
  }
}

const DataSection = ({ title, total, data, ...props }) => {
  const cols = [
    'id',
    'name',
    'all_avg',
    'all_grd',
    'all_coh',
    'all_sz'
  ]
  return (
    <div {...props}>
      <h2>
        {title} ({data.length} of {total})
      </h2>
      <table>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c}>{d[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DataLoader = props => {
  const loadDataForRegion = useStaticData(
    state => state.loadDataForRegion
  )
  const states = useStaticData(state => state.states)
  const counties = useStaticData(state => state.counties)
  const districts = useStaticData(state => state.districts)
  const schools = useStaticData(state => state.schools)

  const filtered = {
    states: applyFilters(states, filters),
    counties: applyFilters(counties, filters),
    districts: applyFilters(districts, filters),
    schools: applyFilters(schools, filters)
  }

  const regions = ['states', 'counties', 'districts', 'schools']
  const data = [states, counties, districts, schools]

  const handleLoadData = region => {
    console.log(region)
    loadDataForRegion(region, SEDA_PARSER)
  }

  return (
    <div>
      <h1>Seda Data</h1>
      {regions.map(r => (
        <Button key={r} onClick={() => handleLoadData(r)}>
          Load {r}
        </Button>
      ))}
      <h1>Data</h1>
      {data.map((dataSet, i) => {
        return (
          <DataSection
            key={regions[i]}
            title={regions[i]}
            data={filtered[regions[i]]}
            total={dataSet.length}
          />
        )
      })}
    </div>
  )
}

DataLoader.propTypes = {}

export default DataLoader
