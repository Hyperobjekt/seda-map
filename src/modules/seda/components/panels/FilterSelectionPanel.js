import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core'

import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from '../../../../base/components/Panels/SidePanel'
import useUiStore from '../../hooks/useUiStore'
import { getPrefixLang } from '../../../../shared/selectors/lang'
import SedaFilterStateSelect from '../controls/SedaFilterStateSelect'
import SedaFilterLargestSelect from '../controls/SedaFilterLargestSelect'
import CloseIcon from '../../../icons/components/CloseIcon'

const useStyles = makeStyles(theme => ({
  root: {
    '&.panel--open': {
      transform: props =>
        props.condensed
          ? props.showHelp
            ? `translateX(${theme.app.condensedPanelWidth}px)`
            : `translateX(0)`
          : 'translateX(0)'
    }
  },
  title: theme.mixins.boldType,
  body: {
    padding: theme.spacing(1),
    '& > .MuiList-root .MuiButtonBase-root': {
      paddingLeft: 44
    }
  }
}))

const SelectionComponent = ({ selectionId }) => {
  const setFilterPanel = useUiStore(
    state => state.setFilterPanel
  )
  const setSelection = useUiStore(state => state.setSelection)
  const handleSelect = () => {
    setFilterPanel(null)
    setSelection(null)
  }
  switch (selectionId) {
    case 'state':
      return <SedaFilterStateSelect onSelect={handleSelect} />
    case 'largest':
      return <SedaFilterLargestSelect onSelect={handleSelect} />
    default:
      return null
  }
}

const FilterSelectionPanel = props => {
  const condensed = useUiStore(state => state.condensed)
  const showHelp = useUiStore(state => state.showHelp)
  const filterPanel = useUiStore(state => state.filterPanel)
  const setFilterPanel = useUiStore(
    state => state.setFilterPanel
  )
  const panelTitle = getPrefixLang(filterPanel, 'PANEL_TITLE')
  const classes = useStyles({ condensed, showHelp })

  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          {panelTitle}
        </Typography>
        <IconButton onClick={() => setFilterPanel(null)}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SelectionComponent selectionId={filterPanel} />
      </SidePanelBody>
    </SidePanel>
  )
}

FilterSelectionPanel.propTypes = {}

export default FilterSelectionPanel
