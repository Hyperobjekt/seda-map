import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  Button,
  IconButton,
  useTheme
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter,
  ExpansionPanel
} from '../../../../base/components/Panels'
import useUiStore from '../../hooks/useUiStore'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import MenuOpen from '@material-ui/icons/MenuOpen'
import ScatterplotIcon from '@material-ui/icons/ScatterPlot'
import SedaSelectionButton from '../controls/SedaSelectionButton'
import { ScatterplotPreview } from '../scatterplot'
import {
  getLang,
  getLangWithSingleOrNone
} from '../../../../shared/selectors/lang'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.typography.panelHeading,
  details: { padding: 0 },
  body: {
    padding: '4px 0'
  },
  footerPanel: {
    borderTop: `5px solid ${theme.palette.divider}`
  },
  footerCondensed: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    transform: `translate(calc(100% + ${theme.app
      .condensedPanelWidth + theme.spacing(2)}px), 0px)`,
    transition: 'transform 0.2s ease-in-out 0.4s'
  }
}))

const FullPanel = props => {
  const classes = useStyles()
  const theme = useTheme()
  const view = useUiStore(state => state.view)
  const condensed = useUiStore(state => state.condensed)
  const toggleCondensed = useUiStore(
    state => state.toggleCondensed
  )
  const locations = useDataOptions(state => state.locations)
  const metric = useDataOptions(state => state.metric)
  const region = useDataOptions(state => state.region)
  const demographic = useDataOptions(state => state.demographic)
  const showChart = useUiStore(state => state.showChart)
  return (
    <SidePanel open={!condensed} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          Data Options
        </Typography>
        <IconButton onClick={toggleCondensed}>
          <MenuOpen />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SedaSelectionButton
          selectionId="metric"
          value={metric.label}
        />
        <SedaSelectionButton
          selectionId="region"
          value={region.label}
        />
        <SedaSelectionButton
          selectionId="demographic"
          value={getLang('LABEL_STUDENTS_' + demographic.id)}
        />
        <SedaSelectionButton
          selectionId="filter"
          value="No filters applied"
        />
        <SedaSelectionButton
          selectionId="location"
          value={getLangWithSingleOrNone(
            locations.length,
            'PANEL_LOCATION'
          )}
        />
      </SidePanelBody>
      {view === 'map' && (
        <SidePanelFooter
          classes={{
            root: clsx(classes.footerPanel, {
              [classes.footerCondensed]:
                condensed && showChart && view === 'map'
            })
          }}
          sticky>
          <ExpansionPanel
            defaultExpanded
            classes={{ details: classes.details }}
            title="Socioeconomic Status Chart"
            startIcon={<ScatterplotIcon />}>
            <ScatterplotPreview />
          </ExpansionPanel>
        </SidePanelFooter>
      )}
    </SidePanel>
  )
}

FullPanel.propTypes = {}

export default FullPanel
