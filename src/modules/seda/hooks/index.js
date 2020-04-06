import shallow from 'zustand/shallow'
import useDataOptions from './useDataOptions'
import useUiStore from './useUiStore'
import {
  getScatterplotVars,
  getVarNames,
  getFeatureProperty,
  getSizesForRegion,
  getRegionFromFeatureId,
  isGapDemographic,
  getMetricRangeFromVarName,
  getSizerFunctionForRegion,
  getDemographicForVarNames,
  isFeature
} from '../../../shared/selectors'
import { getFiltersLang } from '../../../shared/selectors/lang'
import { getDataForId } from '../../scatterplot/components/ScatterplotBase/utils'
import { getStateName } from '../../../shared/selectors/states'
import useMapStore from './useMapStore'
import { getValuePercentInRange } from '../../scatterplot/utils'
import { loadFeatureFromCoords } from '../../../shared/utils/tilequery'
import { useCallback } from 'react'

export const useLocations = () =>
  useDataOptions(
    state => [state.locations, state.setLocations],
    shallow
  )

export const useLocationsData = () => {
  return useDataOptions(
    state =>
      state.locations.map(l => ({
        ...getDataForId(
          getFeatureProperty(l, 'id'),
          state.data[state.region.id]
        ),
        ...l.properties
      })),
    shallow
  )
}

export const useLocationCount = () => {
  return useDataOptions(state => state.locations.length)
}

export const useAddLocation = () => {
  return useDataOptions(state => state.addLocation)
}

export const useAddLocationById = () => {
  return useDataOptions(state => state.addLocationFromId)
}

export const useRemoveLocation = () => {
  const [locations, setLocations] = useLocations()
  return useCallback(
    location => {
      const id =
        typeof location === 'string'
          ? location
          : location && typeof location === 'object'
          ? getFeatureProperty(location, 'id')
          : null
      if (!id)
        throw new Error('tried to remove invalid location')
      const newLocations = locations.filter(
        l => getFeatureProperty(l, 'id') !== id
      )
      setLocations(newLocations)
    },
    [locations, setLocations]
  )
}

/**
 * Provides data from the store for the given ID
 * @param {string} id
 */
export const useDataForId = id => {
  return useDataOptions(state => {
    if (!id) return null
    const region = getRegionFromFeatureId(id)
    return getDataForId(id, state.data[region])
  })
}

/**
 * Provides name for the given id
 * @param {string} id
 */
export const useNameForId = id => {
  return useDataOptions(state => {
    if (!id) return ''
    const region = getRegionFromFeatureId(id)
    switch (region) {
      case 'states':
        return getStateName(id)
      default:
        return getDataForId(id, state.data[region])['name']
    }
  })
}

export const useActiveLocation = () =>
  useDataOptions(
    state => [state.activeLocation, state.setActiveLocation],
    shallow
  )

export const useActiveLocationData = () => {
  return useDataOptions(state => {
    const id = state.activeLocation
    const locations = state.locations
    const i = locations.findIndex(
      l => getFeatureProperty(l, 'id') === id
    )
    return i > -1
      ? { ...locations[i].properties, id, index: i }
      : {}
  }, shallow)
}

export const useCondensed = () =>
  useUiStore(
    state => [state.condensed, state.toggleCondensed],
    shallow
  )

export const useMetric = () => {
  return useDataOptions(
    state => [state.metric.id, state.setMetric],
    shallow
  )
}

export const useDemographic = () => {
  return useDataOptions(
    state => [state.demographic.id, state.setDemographic],
    shallow
  )
}

/**
 * Provides the type of demographic currently active,
 * either "gap" or "single"
 */
export const useDemographicType = () => {
  return useDataOptions(state =>
    isGapDemographic(state.demographic.id) ? 'gap' : 'single'
  )
}

export const useRegion = () => {
  return useDataOptions(
    state => [state.region.id, state.setRegion],
    shallow
  )
}

export const useRegionFilterSizes = () => {
  return useDataOptions(
    state => getSizesForRegion(state.region.id),
    shallow
  )
}
export const useFilters = () => {
  return useDataOptions(
    state => [state.filters, state.setFilters, state.setFilter],
    shallow
  )
}

export const useHovered = () => {
  return useUiStore(
    state => [state.hovered, state.setHovered],
    shallow
  )
}

export const useActiveFilterLang = () => {
  return useDataOptions(state => {
    const filters = state.filters
    const region = state.region
    return getFiltersLang(filters, region)
  })
}

export const useActiveFilterSelection = () => {
  return useUiStore(
    state => [state.filterPanel, state.setFilterPanel],
    shallow
  )
}

/**
 * Provides boolean and setter that determines if
 * markers should show for the hovered location.
 * Markers include map outline, scatterplot dot outline,
 * and map legend tick.
 */
export const useMarkersVisibility = () => {
  return useUiStore(
    state => [state.showMarkers, state.setShowMarkers],
    shallow
  )
}

/**
 * Provides the currently active selection panel (if any)
 * and setter function
 * @returns [string, function]
 */
export const useActiveSelection = () => {
  return useUiStore(
    state => [state.selection, state.setSelection],
    shallow
  )
}

/**
 * Value and setter for current view
 * ("map", "chart", or "split")
 * @returns [string, function]
 */
export const useActiveView = () => {
  return useUiStore(
    state => [state.view, state.setView],
    shallow
  )
}

export const useChartVisible = () => {
  return useUiStore(
    state => [state.showChart, state.toggleChart],
    shallow
  )
}

export const useMenuVisibility = () => {
  return useUiStore(
    state => [state.showMenu, state.toggleMenu],
    shallow
  )
}

export const useHelpVisibility = () => {
  return useUiStore(
    state => [state.showHelp, state.toggleHelp],
    shallow
  )
}

export const useLinkDialogVisibility = () => {
  return useUiStore(
    state => [state.showLinkDialog, state.toggleLinkDialog],
    shallow
  )
}

export const useEmbedDialogVisibility = () => {
  return useUiStore(
    state => [state.showEmbedDialog, state.toggleEmbedDialog],
    shallow
  )
}

export const useActiveOptionIds = () => {
  return useDataOptions(
    state => [
      state.metric.id,
      state.demographic.id,
      state.region.id
    ],
    shallow
  )
}

export const useTooltipCoords = () => {
  return useUiStore(
    state => [state.coords, state.setCoords],
    shallow
  )
}

export const useTooltipVisibility = () => {
  return useUiStore(
    state => [state.showTooltip, state.setShowTooltip],
    shallow
  )
}

/**
 * Provides scatterplot vars for current state
 */
export const useScatterplotVars = () => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region.id,
        state.metric.id,
        state.demographic.id,
        'chart'
      ),
    shallow
  )
}

/**
 *
 */
export const useScatterplotData = () => {
  return useDataOptions(
    state => [state.data, state.setData],
    shallow
  )
}

/**
 * Provides functions for positioning and sizing
 * based on x, y, z values
 */
export const useXyzTransformers = () => {
  const [xVar, yVar] = useScatterplotVars()
  const [region] = useRegion()
  const invertX = region === 'schools'
  const xRange = getMetricRangeFromVarName(xVar, region)
  const yRange = getMetricRangeFromVarName(yVar, region)
  // function that converts xValue to the % position on the scale
  const xValToPosition = val =>
    getValuePercentInRange(val, xRange, invertX)
  // function that converts yValue to the % position on the scale
  const yValToPosition = val =>
    100 - getValuePercentInRange(val, yRange)
  // function that converts z value to circle radius in px
  const dem = getDemographicForVarNames(xVar, yVar)
  const zValToSize = getSizerFunctionForRegion(region, dem)
  // return transformers
  return [xValToPosition, yValToPosition, zValToSize]
}

/**
 * Provides map vars for current state
 */
export const useMapVars = () => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region.id,
        state.metric.id,
        state.demographic.id,
        'map'
      ),
    shallow
  )
}

/**
 * Provides pixel dimensions of the map viewport
 */
export const useMapSize = () => {
  return useMapStore(
    state => [state.viewport.width, state.viewport.height],
    shallow
  )
}

export const useMapViewport = () => {
  return useMapStore(
    state => [state.viewport, state.setViewport],
    shallow
  )
}
