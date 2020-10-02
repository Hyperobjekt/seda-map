import shallow from 'zustand/shallow'
import useDataOptions from './useDataOptions'
import useUiStore from './useUiStore'
import { isGapDemographic } from '../selectors'
import { getVarNames } from '../selectors/data'

/**
 * Provides the current values for metric, demographic, and region
 * @returns {[string, string, string]} [metricId, demographicId, regionId]
 */
export const useActiveOptionIds = () => {
  return useDataOptions(
    state => [state.metric, state.demographic, state.region],
    shallow
  )
}

/**
 * Provides the current metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export const useMetric = () => {
  return useDataOptions(
    state => [state.metric, state.setMetric],
    shallow
  )
}

/**
 * Provides the secondary metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export const useSecondary = () => {
  return useDataOptions(
    state => [state.secondary, state.setSecondary],
    shallow
  )
}

/**
 * Provides the current demographic id and setter
 * @returns {[string, function]} [demographicId, setDemographic]
 */
export const useDemographic = () => {
  return useDataOptions(
    state => [state.demographic, state.setDemographic],
    shallow
  )
}

/**
 * Provides the type of demographic currently active
 * @returns {string} `gap` or `single`
 */
export const useDemographicType = () => {
  return useDataOptions(state =>
    isGapDemographic(state.demographic) ? 'gap' : 'single'
  )
}

/**
 * Provides the current region id and setter
 * @returns {[string, function]} [regionId, setRegion]
 */
export const useRegion = () => {
  return useDataOptions(
    state => [state.region, state.setRegion],
    shallow
  )
}

/**
 * Provides the id of the hovered location and setter
 * @returns {[string, function]} [ hoveredId, setHovered ]
 */
export const useHovered = () => {
  return useUiStore(
    state => [state.hovered, state.setHovered],
    shallow
  )
}

/**
 * User Interface
 * ---------
 * Interactions with store for user interface control
 */

/**
 * Provides boolean and setter that determines if
 * markers should show for the hovered location.
 * Markers include map outline, scatterplot dot outline,
 * and map legend tick.
 * @returns {[boolean, Function]} [ showMarkers, setShowMarkers ]
 */
export const useMarkersVisibility = () => {
  return useUiStore(
    state => [state.showMarkers, state.setShowMarkers],
    shallow
  )
}

/**
 * Provides link dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showLinkDialog, toggleLinkDialog ]
 */
export const useLinkDialogVisibility = () => {
  return useUiStore(
    state => [state.showLinkDialog, state.toggleLinkDialog],
    shallow
  )
}

/**
 * Provides embed dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showEmbedDialog, toggleEmbedDialog ]
 */
export const useEmbedDialogVisibility = () => {
  return useUiStore(
    state => [state.showEmbedDialog, state.toggleEmbedDialog],
    shallow
  )
}

/**
 * Value and setter for current view ("map", "chart", or "split")
 * @returns [string, function]
 */
export const useActiveView = () => {
  return useUiStore(
    state => [state.view, state.setView],
    shallow
  )
}

export { default as useUiStore } from './useUiStore'
export { default as useSiteStore } from './useSiteStore'
export { default as useDataOptions } from './useDataOptions'
export { default as useCurrentVars } from './useCurrentVars'
