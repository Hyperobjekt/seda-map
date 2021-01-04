import React from 'react'
import PropTypes from 'prop-types'
import { ListSubheader } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import SedaKeyMetricListItem from './SedaKeyMetricListItem'
import { getMetricIdFromVarName } from '../../app/selectors'
import { useMetric } from '../../app/hooks'

const SedaLocationKeyMetrics = ({location}) => {
  const varNames = ['all_avg', 'all_grd', 'all_coh']
  const [metric, setMetric] = useMetric()


  const handleMetricSelect = varName => {
    const newMetric = getMetricIdFromVarName(varName)
    setMetric(newMetric)
  }

  return (
    <>
      <ListSubheader>
        {getLang('LOCATION_SUBHEADING_OVERALL')}
      </ListSubheader>
      {varNames.map(varName => (
        <SedaKeyMetricListItem
          key={varName}
          varName={varName}
          value={location[varName]}
          interval={location[varName + '_e']}
          selected={
            getMetricIdFromVarName(varName) === metric
          }
          button
          onClick={() => handleMetricSelect(varName)}
        />
      ))}
    </>
  )
}

SedaLocationKeyMetrics.propTypes = {

}

export default SedaLocationKeyMetrics
