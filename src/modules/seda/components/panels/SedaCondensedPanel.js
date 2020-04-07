import React from 'react'
import { makeStyles, Divider } from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels'
import IconLabelButton from '../../../../base/components/IconLabelButton'

import {
  MetricIcon,
  FilterIcon,
  SubgroupsIcon,
  RegionsIcon,
  ChartIcon,
  LocationsIcon,
  SidebarOpenIcon
} from '../../../icons'

import { getMetricLabel } from '../../../../shared/selectors'
import {
  getPrefixLang,
  getLang,
  getRegionLabel,
  getDemographicLabel,
  getLangWithSingleOrNone
} from '../../../../shared/selectors/lang'
import DetailedTooltip from '../base/DetailedTooltip'
import clsx from 'clsx'
import {
  useCondensed,
  useActiveLocation,
  useActiveOptionIds,
  useActiveSelection,
  useLocationCount,
  useChartVisible,
  useActiveView,
  useActiveFilterLang,
  useActiveFilterSelection
} from '../../hooks'

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

const SedaCondensedPanel = props => {
  const classes = useStyles()
  const [condensed, toggleCondensed] = useCondensed()
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [
    filterSelection,
    setFilterSelection
  ] = useActiveFilterSelection()
  const [metricId, demId, regionId] = useActiveOptionIds()
  const [view] = useActiveView()
  const [selection, setSelection] = useActiveSelection()
  const [showChart, toggleChart] = useChartVisible()
  const locationCount = useLocationCount()
  const filterLabel = useActiveFilterLang()

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
    filterSelection && setFilterSelection(null)
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
          tooltip={
            selection !== 'filter' && (
              <DetailedTooltip
                primary={getPrefixLang('filter', 'PANEL_TITLE')}
                secondary={filterLabel}
                hint={getLang('TOOLTIP_HINT_REGION')}
              />
            )
          }
          icon={<FilterIcon style={{ fontSize: 32 }} />}
          onClick={() => handleSelection('filter')}
        />
        <IconLabelButton
          active={selection === 'location'}
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
          icon={<LocationsIcon />}
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
