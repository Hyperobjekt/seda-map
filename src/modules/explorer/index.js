import React, { useEffect } from 'react'
import SedaLayout from './components/SedaLayout'
import { useIdMap, useRouterParams } from './hooks'
import useDebounce from '../../shared/hooks/useDebounce'

function SedaApp() {
  return <SedaLayout />
}

export default SedaApp
