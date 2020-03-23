import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Divider } from '@material-ui/core'
import useUiStore from '../../hooks/useUiStore'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels'
import IconLabelButton from '../../../../base/components/IconLabelButton'
import useDataOptions from '../../hooks/useDataOptions'

import MenuOpen from '@material-ui/icons/MenuOpen'
import PlaceIcon from '@material-ui/icons/Place'
import MetricIcon from '../icons/MetricIcon'
import LayersIcon from '@material-ui/icons/Layers'
import ScatterplotIcon from '@material-ui/icons/ScatterPlot'
import FilterIcon from '../icons/FilterIcon'
import PeopleIcon from '@material-ui/icons/PeopleAlt'
import { getMetricLabel } from '../../../../shared/selectors'
import {
  getSelectionLabel,
  getLang,
  getRegionLabel,
  getDemographicLabel,
  getLangWithSingleOrNone
} from '../../../../shared/selectors/lang'
import DetailedTooltip from '../base/DetailedTooltip'

const useStyles = makeStyles(theme => ({
  header: {
    padding: 0
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

const CondensedPanel = props => {
  const classes = useStyles()
  const toggleCondensed = useUiStore(
    state => state.toggleCondensed
  )
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const region = useDataOptions(state => state.region)
  const view = useUiStore(state => state.view)
  const locations = useDataOptions(state => state.locations)
  const filters = []
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  const showChart = useUiStore(state => state.showChart)
  const toggleChart = useUiStore(state => state.toggleChart)
  return (
    <SidePanel condensed {...props}>
      <SidePanelHeader classes={{ root: classes.header }}>
        <IconLabelButton
          className={classes.button}
          tooltip={getLang('TOOLTIP_HINT_SHOW')}
          icon={
            <MenuOpen
              style={{
                fontSize: 32,
                transform: `rotate(180deg)`
              }}
            />
          }
          onClick={toggleCondensed}
        />
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <IconLabelButton
          className={classes.button}
          active={selection === 'metric'}
          tooltip={
            selection !== 'metric' && (
              <DetailedTooltip
                primary={getSelectionLabel('metric')}
                secondary={getMetricLabel(metric.id)}
                hint={getLang('TOOLTIP_HINT_METRIC')}
              />
            )
          }
          icon={
            <MetricIcon
              metricId={metric.id}
              style={{ fontSize: 32 }}
            />
          }
          onClick={() => setSelection('metric')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'region'}
          tooltip={
            selection !== 'region' && (
              <DetailedTooltip
                primary={getSelectionLabel('region')}
                secondary={getRegionLabel(region.id)}
                hint={getLang('TOOLTIP_HINT_REGION')}
              />
            )
          }
          icon={<LayersIcon style={{ fontSize: 32 }} />}
          onClick={() => setSelection('region')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'demographic'}
          tooltip={
            selection !== 'demographic' && (
              <DetailedTooltip
                primary={getSelectionLabel('demographic')}
                secondary={getDemographicLabel(
                  demographic.id,
                  'LABEL_STUDENTS'
                )}
                hint={getLang('TOOLTIP_HINT_DEMOGRAPHIC')}
              />
            )
          }
          icon={<PeopleIcon />}
          onClick={() => setSelection('demographic')}
        />
        <IconLabelButton
          className={classes.button}
          active={selection === 'filter'}
          tooltip={
            selection !== 'filter' && (
              <DetailedTooltip
                primary={getSelectionLabel('filter')}
                secondary={getLangWithSingleOrNone(
                  filters.length,
                  'PANEL_FILTER'
                )}
                hint={getLang('TOOLTIP_HINT_REGION')}
              />
            )
          }
          icon={<FilterIcon style={{ fontSize: 32 }} />}
          onClick={() => setSelection('filter')}
        />
        <IconLabelButton
          active={selection === 'location'}
          tooltip={
            selection !== 'location' && (
              <DetailedTooltip
                primary={getSelectionLabel('location')}
                secondary={getLangWithSingleOrNone(
                  locations.length,
                  'PANEL_LOCATION'
                )}
                hint={getLang('TOOLTIP_HINT_LOCATION')}
              />
            )
          }
          className={classes.button}
          icon={<PlaceIcon />}
          onClick={() => setSelection('location')}
        />
        <Divider />
        {view === 'map' && (
          <IconLabelButton
            active={showChart}
            tooltip={getLang('TOOLTIP_HINT_CHART')}
            className={classes.button}
            icon={<ScatterplotIcon />}
            onClick={toggleChart}
          />
        )}
      </SidePanelBody>
    </SidePanel>
  )
}

CondensedPanel.propTypes = {}

export default CondensedPanel
