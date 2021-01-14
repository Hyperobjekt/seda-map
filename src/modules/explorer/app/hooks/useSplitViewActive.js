import { useMediaQuery, useTheme } from "@material-ui/core"
import { useMemo } from "react"
import { hasSecondaryChart } from "../selectors/metrics"
import useDataOptions from "./useDataOptions"
import useUiStore from "./useUiStore"

/**
 * A hook that returns true if a split view is currently active
 */
export default function useSplitViewActive() {
  const demographic = useDataOptions(state => state.demographic)
  const secondaryChart = hasSecondaryChart(demographic)
  const view = useUiStore(state => state.view)
  const theme = useTheme()
  const isWideEnough = useMediaQuery(
    theme.breakpoints.up('md')
  )
  return useMemo(() => {
    if (!isWideEnough) return false
    return (view === 'chart' && secondaryChart) || (view === 'split')
  }, [ isWideEnough, view, secondaryChart])

}