import React from 'react'
import PropTypes from 'prop-types'
import SedaMenu from './SedaMenu'
import { useMetric } from '../app/hooks'
import { getKeyMetrics } from '../app/selectors'

const SedaMetricSelect = ({ onSelect, ...props }) => {
  const [metric, setMetric] = useMetric()
  const metrics = getKeyMetrics().map(m => m.id)

  const handleClick = metricId => {
    if (metric !== metricId) {
      setMetric(metricId)
      onSelect && onSelect(metricId)
    }
  }

  return (
    <SedaMenu
      value={metric}
      items={metrics}
      onClick={handleClick}
      {...props}
    />
  )
}

SedaMetricSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaMetricSelect
