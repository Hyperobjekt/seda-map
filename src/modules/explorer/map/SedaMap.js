import React, {
  useMemo,
  useEffect,
  useRef,
  useState
} from 'react'
import { makeStyles } from '@material-ui/core'
import { getLayers } from './selectors'
import MapBase, { useMapStore } from '../../map'
import {
  getSelectedColors,
  getFeatureProperty
} from '../app/selectors'
import { getLang } from '../app/selectors/lang'
import SedaMapLegend from './SedaMapLegend'
import {
  useActiveOptions,
  useAppContext,
  useHovered,
  useMarkersVisibility
} from '../app/hooks'
import { REGION_TO_ID_LENGTH } from '../app/constants/regions'
import { useFilters, getActiveFilterCount } from '../filters'
import {
  useLocations,
  useAddLocation,
  useActiveLocationData,
  getLocationIdsForRegion
} from '../location'
import useFlyToLocation from './hooks/useFlyToLocation'
import { SEDA_SOURCES } from './constants'
import { NavigationControl } from 'react-map-gl'
import SedaZoomControls from './SedaZoomControls'
import clsx from 'clsx'

const selectedColors = getSelectedColors()

const useStyles = makeStyles(theme => ({
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      bottom: 'auto',
      top: 0,
      right: 0,
      width: "100%",
      alignItems: "flex-start",
    }
  },
  zoomControls: {
    position: 'absolute',
    top: '50%',
    transform: `translateY(-50%)`,
    height: 'auto',
    right: '24px',
    left: 'auto',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
      right: 0
    }
  }
}))

/**
 * Displays the map with SEDA data layers
 */
const SedaMap = props => {
  /** current options for the map */
  const [metric, demographic] = useActiveOptions()
  // currently active data filters
  const filters = useFilters()
  const {
    data,
    region,
    mapVars: [, yVar],
    colorExtent
  } = useAppContext()
  /** currently selected location ids */
  const [locations] = useLocations()
  /** id of the currently hovered location */
  const [hoveredId, setHovered] = useHovered()
  /** id of the active location */
  const activeLocation = useActiveLocationData()
  /** boolean determining if the hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** function to add a location to the selected locations */
  const addLocation = useAddLocation()
  /** id map is used to map long school identifiers to feature ids on the map for hover */
  const [idMap, setIdMap] = useState({})
  const flyToLocation = useFlyToLocation()
  const setViewport = useMapStore(state => state.setViewport)

  const isLoaded = useRef(false)
  /** memoized array of choropleth and dot layers */
  const layers = useMemo(() => {
    if (!yVar || !region) {
      return []
    }
    const ids =
      getActiveFilterCount(filters) > 0
        ? data.map(d => d.id)
        : null
    const context = {
      varName: yVar,
      region,
      filters,
      ids,
      colorExtent
    }
    return getLayers(context)
  }, [region, yVar, filters, data, colorExtent])
  /** aria label for screen readers */
  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric),
    region: getLang('LABEL_' + region),
    demographic: getLang('LABEL_STUDENTS_' + demographic)
  })
  /** object with class names for styling the component */
  const classes = useStyles()

  /** handler for map hover */
  const handleHover = (feature, coords) => {
    const id = getFeatureProperty(feature, 'id')
    if (id && id !== hoveredId) {
      // add schools to the ID map
      id.length === REGION_TO_ID_LENGTH['schools'] &&
        setIdMap({ ...idMap, [id]: feature.id })
    }
    setHovered(id, coords)
  }

  /** handler for map click */
  const handleClick = feature => {
    const id = getFeatureProperty(feature, 'id')
    addLocation(id)
  }

  /** handler for map load */
  const handleLoad = () => {
    // inform global listener that map has loaded
    // window.SEDA.trigger('map')
    // zoom to US if needed once cover is shown
    // setTimeout(() => {
    //   flyToReset()
    // }, 1000)
    isLoaded.current = true
  }

  /** zoom to activated location */
  useEffect(() => {
    if (activeLocation && isLoaded.current) {
      flyToLocation(activeLocation)
    }
  }, [activeLocation, flyToLocation])

  const locationIds = getLocationIdsForRegion(region, locations)

  return (
    <MapBase
      selectedColors={selectedColors}
      sources={SEDA_SOURCES}
      layers={layers}
      idMap={idMap}
      selectedIds={locationIds}
      hoveredId={
        showHovered && hoveredId ? hoveredId : undefined
      }
      ariaLabel={ariaLabel}
      onHover={handleHover}
      onLoad={handleLoad}
      onClick={handleClick}>
      <div className={clsx('map__zoom', classes.zoomControls)}>
        <NavigationControl
          showCompass={false}
          onViewportChange={setViewport}
        />
        <SedaZoomControls />
      </div>
      <SedaMapLegend className={classes.legend} />
    </MapBase>
  )
}

export default SedaMap
