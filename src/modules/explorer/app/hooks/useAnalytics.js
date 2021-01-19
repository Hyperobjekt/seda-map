import useMetric from './useMetric'
import {useEffect} from 'react'

export default function useAnalytics() {
  const [metric] = useMetric()
  // triggered every time the metric changes
  useEffect(() => {
    window.dataLayer.push({event: 'metricSelected', metricSelection: metric })
  }, [metric])

  // ... analytics triggers for remaining events
}