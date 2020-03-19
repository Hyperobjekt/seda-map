import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  Button,
  Divider
} from '@material-ui/core'
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

const DetailedTooltip = ({
  primary,
  secondary,
  hint,
  ...props
}) => {}

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
  const view = useUiStore(state => state.view)
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  const toggleChart = useUiStore(state => state.toggleChart)
  return (
    <SidePanel condensed {...props}>
      <SidePanelHeader classes={{ root: classes.header }}>
        <IconLabelButton
          className={classes.button}
          tooltip="Show all data options"
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
          tooltip="Show educational opportunity metrics"
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
          tooltip="Show data region selection (state, counties, districts, schools)"
          icon={<LayersIcon style={{ fontSize: 32 }} />}
          onClick={() => setSelection('region')}
        />
        <IconLabelButton
          className={classes.button}
          tooltip="Show subgroups and gaps"
          icon={<PeopleIcon />}
          onClick={() => setSelection('demographic')}
        />
        <IconLabelButton
          className={classes.button}
          tooltip="Show data filtering options"
          icon={<FilterIcon style={{ fontSize: 32 }} />}
          onClick={() => setSelection('filter')}
        />
        <IconLabelButton
          tooltip="Show pinned locations"
          className={classes.button}
          icon={<PlaceIcon />}
          onClick={() => setSelection('location')}
        />
        <Divider />
        {view === 'map' && (
          <IconLabelButton
            tooltip="Toggle socioeconomic status chart"
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
