import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  Button,
  IconButton
} from '@material-ui/core'
import { ExpansionPanel } from '../../../../base/components/Panels'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels/SidePanel'
import useUiStore from '../../hooks/useUiStore'
import SedaMetricSelect from '../controls/SedaMetricSelect'
import SedaDemographicSelect from '../controls/SedaDemographicSelect'
import SedaRegionSelect from '../controls/SedaRegionSelect'

import SedaLocationSelect from '../controls/SedaLocationSelect'
import { getSelectionLabel } from '../../../../shared/selectors/lang'
import CloseIcon from '@material-ui/icons/Close'
import SearchInput from '../../../../base/components/SearchInput'

const useStyles = makeStyles(theme => ({
  root: {
    '&.panel--open': {
      transform: props =>
        props.condensed ? 'translateX(0)' : 'translateX(-100%)'
    }
  },
  title: theme.typography.panelHeading,
  body: {
    padding: theme.spacing(1),
    '& > .MuiList-root .MuiButtonBase-root': {
      paddingLeft: 40
    }
  }
}))

const SelectionComponent = ({ selectionId }) => {
  const setSelection = useUiStore(state => state.setSelection)
  switch (selectionId) {
    case 'metric':
      return (
        <>
          <SedaMetricSelect
            onSelect={() => setSelection(null)}
          />
          <Typography
            style={{ display: 'block', padding: 16 }}
            variant="caption">
            The educational opportunity metrics above are based
            on test scores for students in grades 3 - 8 for the
            years 2009 - 2016.
          </Typography>
        </>
      )
    case 'demographic':
      return (
        <SedaDemographicSelect
          onSelect={() => setSelection(null)}
        />
      )
    case 'region':
      return (
        <SedaRegionSelect onSelect={() => setSelection(null)} />
      )
    case 'filter':
      return (
        <div>
          <ExpansionPanel
            title="Filter By Size"
            style={{ margin: `0 -8px` }}>
            list of sizes
          </ExpansionPanel>
          <ExpansionPanel
            title="Filter By State"
            style={{ margin: `0 -8px` }}>
            List of states
          </ExpansionPanel>
          <ExpansionPanel
            title="Filter By School District"
            style={{ margin: `0 -8px` }}>
            School district selection
          </ExpansionPanel>
        </div>
      )
    case 'location':
      return <SedaLocationSelect />
    default:
      return null
  }
}

const SelectionPanel = props => {
  const condensed = useUiStore(state => state.condensed)
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  const panelTitle = getSelectionLabel(selection)
  const classes = useStyles({ condensed })

  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          {panelTitle}
        </Typography>
        <IconButton onClick={() => setSelection(null)}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SelectionComponent selectionId={selection} />
      </SidePanelBody>
    </SidePanel>
  )
}

SelectionPanel.propTypes = {}

export default SelectionPanel
