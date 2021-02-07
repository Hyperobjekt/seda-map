import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import {
  getPredictedValue,
  getRegionFromLocationId
} from '../../app/selectors'
import {
  useLocationData,
  getLocationNameString,
} from '..'
import { formatNumber } from '../../../../shared/utils'
import { hasVal } from '../../app/selectors/data'
import { getStateName } from '../../../../shared/utils/states'
import axios from 'axios'

/**
 * Returns a singular region name for the PDF export
 * @param {*} region
 */
const getPdfRegion = region => {
  return region === 'counties'
    ? 'county'
    : region === 'districts'
    ? 'district'
    : region === 'schools'
    ? 'school' 
    : 'state'
}

/**
 * Gets the difference from "average" values for key metrics
 * @param {*} locationData
 */
const getDiffValues = locationData => {
  const id = locationData['id']
  const region = getRegionFromLocationId(id)
  const metrics = ['avg', 'grd', 'coh']
  const values = metrics.map(m => locationData['all_' + m])
  const ses =
    region === 'schools'
      ? locationData['all_frl']
      : locationData['all_ses']
  const diffs = values.map((val, i) =>
    hasVal(val) && hasVal(ses)
      ? formatNumber(
          val - getPredictedValue(ses, metrics[i], region)
        )
      : null
  )
  return diffs
}

/**
 * Sends a request to the report endpoint to generate a PDF report
 * @param {*} locationData
 */
export const fetchReport = locationData => {
  const id = locationData['id']
  const region = getRegionFromLocationId(id)
  const diffs = getDiffValues(locationData)
  //fire analytics events
  window.dataLayer.push({event: 'reportDownloaded', geoTypeSelection: region, locationId: id, locationName: getLocationNameString(id)})
  return axios({
    url: 'https://export.edopportunity.org/',
    method: 'POST',
    data: {
      // need singular region name for PDF
      region: getPdfRegion(region),
      location: {
        ...locationData,
        state_name: getStateName(id),
        diff_avg: diffs[0],
        diff_grd: diffs[1],
        diff_coh: diffs[2]
      },
      url: window.location.href,
      others: null
    },
    responseType: 'blob' // important
  })
}

/**
 * Handle the PDF response from the server and trigger the download
 * @param {*} locationData
 */
const handleResponse = locationData => response => {
  const url = window.URL.createObjectURL(
    new Blob([response.data])
  )
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', locationData.name + '.pdf')
  document.body.appendChild(link)
  link.click()
}

/**
 * Button that downloads a report for the active location when pressed
 */
const DownloadReportButton = ({ location, ...props }) => {
  const [loading, setLoading] = useState(false)
  const handleDownloadReport = () => {
    setLoading(true)
    fetchReport(location)
      .then(handleResponse(location))
      .then(() => setLoading(false))
      .catch(error => {
        setLoading(false)
        console.error(error)
      })
  }
  return (
    <Button
      disabled={loading}
      onClick={handleDownloadReport}
      {...props}>
      {loading
        ? 'Generating...'
        : getLang('LOCATION_REPORT_BUTTON')}
    </Button>
  )
}

DownloadReportButton.propTypes = {
  /** Location data object */
  location: PropTypes.object
}

export default DownloadReportButton
