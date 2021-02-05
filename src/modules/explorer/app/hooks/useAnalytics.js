import useMetric from './useMetric'
import useDemographic from './useDemographic'
import useRegion from './useRegion'
import useActiveView from './useActiveView'
import useFilterLocationName from '../../filters/hooks/useFilterLocationName'
import useDataOptions from './useDataOptions'
import useUiStore from './useUiStore'

import {useEffect} from 'react'

export default function useAnalytics() {
  const metric = useMetric();
  const demographic = useDemographic();
  const region = useRegion();
  const view = useActiveView();
  const filterLocation = useFilterLocationName();
  const searchLocation = useDataOptions().activeLocation;
  const previewChart = useUiStore().showChart;

  // triggered every time the metric changes
  useEffect(() => {
    window.dataLayer.push({event: 'metricSelected', metricSelection: metric[0] })
    console.log(metric[0])
  }, [metric])
  useEffect(() => {
    window.dataLayer.push({event: 'studentTypeSelected', studentTypeSelection: demographic[0] })
    console.log(demographic[0])
  }, [demographic])
  useEffect(() => {
    window.dataLayer.push({event: 'geoTypeSelected', geoTypeSelection: region[0] })
    console.log(region[0])
  }, [region])
  useEffect(() => {
    window.dataLayer.push({event: 'displayTypeSelected', displayTypeSelection: view[0] })
    console.log(view[0])
  }, [view])
  useEffect(() => {
    window.dataLayer.push({event: 'geoSelected', geoSelection: filterLocation })
    console.log(filterLocation)
  }, [filterLocation])
  useEffect(() => {
    window.dataLayer.push({event: 'searchSelected', searchSelection: searchLocation })
    console.log(searchLocation)
  }, [searchLocation])
  useEffect(() => {
    window.dataLayer.push({event: 'chartButtonSelected', chartButtonSelecteion: previewChart })
    console.log(previewChart)
  }, [previewChart])

  // ... analytics triggers for remaining events
}