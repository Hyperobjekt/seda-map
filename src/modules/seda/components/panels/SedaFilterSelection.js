import React from 'react'
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
import { getPrefixLang } from '../../../../shared/selectors/lang'
import SedaFilterStateSelect from '../controls/SedaFilterStateSelect'
import SedaFilterLargestSelect from '../controls/SedaFilterLargestSelect'
import { CloseIcon } from '../../../icons'
import {
  useCondensed,
  useHelpVisibility,
  useActiveFilterSelection,
  useActiveSelection
} from '../../hooks'

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

const SelectionComponent = ({ selectionId, onSelect }) => {
  switch (selectionId) {
    case 'state':
      return <SedaFilterStateSelect onSelect={onSelect} />
    case 'largest':
      return <SedaFilterLargestSelect onSelect={onSelect} />
    default:
      return null
  }
}

const SedaFilterSelection = props => {
  const [condensed] = useCondensed()
  const [showHelp] = useHelpVisibility()
  const [
    filterPanel,
    setFilterPanel
  ] = useActiveFilterSelection()
  const [, setSelection] = useActiveSelection()
  const panelTitle = getPrefixLang(filterPanel, 'PANEL_TITLE')
  const classes = useStyles({ condensed, showHelp })

  const handleClear = () => {
    setFilterPanel(null)
    setSelection(null)
  }

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
        <SelectionComponent
          selectionId={filterPanel}
          onSelect={handleClear}
        />
      </SidePanelBody>
    </SidePanel>
  )
}

export default SedaFilterSelection
