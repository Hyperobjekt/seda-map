import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import useCompareStore from '../hooks/useCompareStore'
import shallow from 'zustand/shallow'

const makeCsv = (data) => {
  const colNames = Object.keys(data[0])
  data.map(d => colNames.map(col => d[col]).join(',')).join('\n')
}

const CompareExportButton = ({...props}) => {

  const locations = useCompareStore(state => state.locations, shallow)

  const handleExport = () => {
    const csvText = makeCsv(locations)
    console.log('export', locations, csvText)
  }

  return (
    <Button onClick={handleExport} {...props}>
      {getLang("LABEL_EXPORT_CSV")}
    </Button>
  )
}

CompareExportButton.propTypes = {
  /** an array of objects to export as CSV */
  data: PropTypes.object,
}

export default CompareExportButton
