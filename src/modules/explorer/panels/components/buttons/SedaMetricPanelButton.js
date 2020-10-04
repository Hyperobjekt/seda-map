import React from 'react'
import SedaPanelButton from './SedaPanelButton'
import { MetricIcon } from '../../../../icons'
import { useMetric } from '../../../app/hooks'
import { getPrefixLang } from '../../../app/selectors/lang'

/** Panel button to open the metric selection */
export default function SedaMetricPanelButton(props) {
  const [metric] = useMetric()
  return (
    <SedaPanelButton
      selectionId="metric"
      secondary={getPrefixLang(metric, 'LABEL')}
      icon={<MetricIcon metricId={metric} />}
      {...props}
    />
  )
}
