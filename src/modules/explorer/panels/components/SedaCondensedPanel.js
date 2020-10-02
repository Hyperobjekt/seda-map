import React from 'react'
import { makeStyles, Divider } from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  IconLabelButton,
  DetailedTooltip
} from '../../../../shared'

import {
  MetricIcon,
  FilterIcon,
  SubgroupsIcon,
  RegionsIcon,
  ChartIcon,
  LocationsIcon,
  SidebarOpenIcon
} from '../../../icons'

import { getMetricLabel } from '../../app/selectors'
import {
  getPrefixLang,
  getLang,
  getRegionLabel,
  getDemographicLabel,
  getLangWithSingleOrNone
} from '../../app/selectors/lang'
import clsx from 'clsx'
import {
  useActiveOptionIds,
  useActiveView
} from '../../app/hooks'
import { useActiveFilters } from '../../filters'
import {
  useActiveLocation,
  useLocationCount
} from '../../location'
import useCondensedPanel from '../hooks/useCondensedPanel'
import useActivePanel from '../hooks/useActivePanel'
import usePanelChartVisible from '../hooks/usePanelChartVisible'

const useStyles = makeStyles(theme => ({
  header: {
    padding: 0,
    '& .icon-label-button': {
      height: theme.spacing(8)
    }
  },
  button: {
    width: theme.app.condensedPanelWidth,
    height: theme.app.condensedPanelWidth,
    padding: theme.spacing(1)
  },
  body: {
    overflowY: 'hidden'
  }
}))

/**
 * Condensed version of the control panel, docked to the side with vertically stacked icons
 */
const SedaCondensedPanel = props => {
  const classes = useStyles()
  const [condensed, toggleCondensed] = useCondensedPanel()
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [metricId, demId, regionId] = useActiveOptionIds()
  const [view] = useActiveView()
  const [selection, setSelection] = useActivePanel()
  const [showChart, toggleChart] = usePanelChartVisible()
  const locationCount = useLocationCount()
  const activeFilters = useActiveFilters()
  // const filterLabel = useActiveFilterLang()

  /**
   * Event handler for when option is selected
   * @param {*} selectionId
   */
  const handleSelection = selectionId =>
    selectionId === selection
      ? setSelection(null)
      : setSelection(selectionId)

  /**
   * Event handler for when expand button is pressed
   */
  const handleShowOptions = () => {
    // clear any active panels
    selection && setSelection(null)
    activeLocation && setActiveLocation(null)
    // switch out of condensed mode if needed
    condensed && toggleCondensed()
  }

  return (
    <SidePanel condensed {...props}>
      <SidePanelHeader classes={{ root: classes.header }}>
        <IconLabelButton
          className={clsx(
            'panel-header__button',
            classes.button
          )}
          tooltip={getLang('TOOLTIP_HINT_SHOW')}
          icon={
            <SidebarOpenIcon
              style={{
                fontSize: 32
              }}
            />
          }
          onClick={handleShowOptions}
        />
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <IconLabelButton
          className={classes.button}
          active={selection === 'metric'}
          tooltip={
            selection !== 'metric' && (
              <DetailedTooltip
                primary={getPrefixLang('metric', 'PANEL_TITLE')}
                secondary={getMetricLabel(metricId)}
                hint={getLang('TOOLTIP_HINT_METRIC')}
              />
            )
          }
          icon={
            <MetricIcon
              metricId={metricId}
              style={{ fontSize: 32 }}
            />
          }
          onClick={() => handleSelection('metric')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'region'}
          tooltip={
            selection !== 'region' && (
              <DetailedTooltip
                primary={getPrefixLang('region', 'PANEL_TITLE')}
                secondary={getRegionLabel(regionId)}
                hint={getLang('TOOLTIP_HINT_REGION')}
              />
            )
          }
          icon={<RegionsIcon style={{ fontSize: 32 }} />}
          onClick={() => handleSelection('region')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'demographic'}
          tooltip={
            selection !== 'demographic' && (
              <DetailedTooltip
                primary={getPrefixLang(
                  'demographic',
                  'PANEL_TITLE'
                )}
                secondary={getDemographicLabel(
                  demId,
                  'LABEL_STUDENTS'
                )}
                hint={getLang('TOOLTIP_HINT_DEMOGRAPHIC')}
              />
            )
          }
          icon={<SubgroupsIcon />}
          onClick={() => handleSelection('demographic')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'filter'}
          indicator={activeFilters.length}
          tooltip={
            selection !== 'filter' && (
              <DetailedTooltip
                primary={getPrefixLang('filter', 'PANEL_TITLE')}
                hint={getLang('TOOLTIP_HINT_REGION')}
              />
            )
          }
          icon={<FilterIcon style={{ fontSize: 32 }} />}
          onClick={() => handleSelection('filter')}
        />
        <IconLabelButton
          active={selection === 'location'}
          indicator={locationCount}
          tooltip={
            selection !== 'location' && (
              <DetailedTooltip
                primary={getPrefixLang(
                  'location',
                  'PANEL_TITLE'
                )}
                secondary={getLangWithSingleOrNone(
                  locationCount,
                  'PANEL_LOCATION'
                )}
                hint={getLang('TOOLTIP_HINT_LOCATION')}
              />
            )
          }
          className={classes.button}
          icon={<LocationsIcon style={{ fontSize: 32 }} />}
          onClick={() => handleSelection('location')}
        />
        <Divider />
        {view === 'map' && condensed && (
          <IconLabelButton
            active={showChart}
            tooltip={getLang('TOOLTIP_HINT_CHART')}
            className={classes.button}
            icon={<ChartIcon />}
            onClick={toggleChart}
          />
        )}
      </SidePanelBody>
    </SidePanel>
  )
}

export default SedaCondensedPanel
