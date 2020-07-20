import React, { useMemo } from 'react'
import useStaticData from './useStaticData'
import { applyFilters, FiltersForm } from './Filters'
import useFilterStore from './Filters/useFilterStore'
import DataLoader from './DataLoader'

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

const DataView = props => {
  const data = useStaticData(state => state.data)
  const filters = useFilterStore(state => state.filters)

  console.log('dataview', data, filters)

  const filtered = useMemo(() => {
    return Object.keys(data).reduce((dataObj, key, i) => {
      dataObj[key] = applyFilters(data[key], filters)
      return dataObj
    }, {})
  }, [data, filters])

  return (
    <div style={{ maxWidth: '90vw', margin: 'auto' }}>
      <h1>Data Viewer</h1>
      <DataLoader />
      <FiltersForm style={{ maxWidth: 400 }} />
      <h2>Data</h2>
      {Object.keys(filtered).map((key, i) => {
        return (
          <DataSection
            key={key}
            title={key}
            data={filtered[key]}
            total={data[key].length}
          />
        )
      })}
    </div>
  )
}

export default DataView
