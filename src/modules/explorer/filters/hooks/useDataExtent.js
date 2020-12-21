import { useMemo } from 'react'
import useFilteredData from './useFilteredData'

export default function useDataExtent(metric) {
  const data = useFilteredData()
  return useMemo(() => {
    console.log('data extent', data)
    return []
  }, [data])
}
