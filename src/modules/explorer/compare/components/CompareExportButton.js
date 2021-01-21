import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import useCompareLocationsData from '../hooks/useCompareLocationsData'
import { getFormatterForVarName } from '../../app/selectors'

const makeCsv = data => {
  const dontExport = [
    'lat',
    'lon',
    'r',
    's',
    't',
    'u',
    'seg',
    'min',
    'sz'
  ]
  const dropColumns = [
    'wa'
  ]
  const header = Object.keys(data[0])
    // filter out sizes
    .filter(k => dontExport.indexOf(k.split('_').pop()) === -1)
    .filter(k => dropColumns.indexOf(k.split('_')[0]) === -1)
    // filter out margin of error data
    .filter(k => k.slice(-2) !== '_e')
  const rows = data.map(d => header.map(col => col === 'name' ? d[col] : getFormatterForVarName(col)(d[col])).join(','))
  // map header to label if it exists
  const headerRow = header
    .map(h =>
      getPrefixLang(h).indexOf('LABEL_') === -1
        ? getPrefixLang(h)
        : h
    )
    .join(',')
  return [headerRow, ...rows].join('\n')
}

// prompts a download of the provided text
function download(filename, text) {
  // for excel to interpret at UTF-8
  var universalBOM = '\uFEFF'
  // IE11 Download
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(
      new Blob([universalBOM + text], {
        type: 'text/csv;charset=utf-8;'
      }),
      filename
    )
    return
  }
  // all other browsers
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' +
      encodeURIComponent(universalBOM + text)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const CompareExportButton = ({ ...props }) => {
  const locations = useCompareLocationsData()
  const handleExport = () => {
    const csvText = makeCsv(locations)
    download('educational-opportunity-export.csv', csvText)
  }

  return (
    <Button variant="outlined" onClick={handleExport} {...props}>
      {getLang('LABEL_EXPORT_CSV')}
    </Button>
  )
}

CompareExportButton.propTypes = {
  /** an array of objects to export as CSV */
  data: PropTypes.object
}

export default CompareExportButton
