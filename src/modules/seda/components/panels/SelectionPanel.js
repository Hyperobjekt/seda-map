import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  Button,
  IconButton
} from '@material-ui/core'

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
import { getPrefixLang } from '../../../../shared/selectors/lang'
import CloseIcon from '@material-ui/icons/Close'
import SearchInput from '../../../../base/components/SearchInput'
import SedaFilterSelect from '../controls/SedaFilterSelected'

const useStyles = makeStyles(theme => ({
  root: {
    '&.panel--open': {
      transform: props =>
        props.condensed
          ? props.showHelp
            ? `translateX(${theme.app.condensedPanelWidth}px)`
            : `translateX(0)`
          : 'translateX(-100%)'
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
      return <SedaFilterSelect />
    case 'location':
      return <SedaLocationSelect />
    default:
      return null
  }
}

const SelectionPanel = props => {
  const condensed = useUiStore(state => state.condensed)
  const showHelp = useUiStore(state => state.showHelp)
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  const panelTitle = getPrefixLang(selection, 'PANEL_TITLE')
  const classes = useStyles({ condensed, showHelp })

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
