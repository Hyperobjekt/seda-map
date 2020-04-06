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
import SedaMetricSelect from '../controls/SedaMetricSelect'
import SedaDemographicSelect from '../controls/SedaDemographicSelect'
import SedaRegionSelect from '../controls/SedaRegionSelect'

import SedaLocationSelect from '../controls/SedaLocationSelect'
import { getPrefixLang } from '../../../../shared/selectors/lang'
import SedaFilterSelect from '../controls/SedaFilterSelected'
import { CloseIcon } from '../../../icons'
import {
  useCondensed,
  useActiveSelection,
  useHelpVisibility
} from '../../hooks'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.mixins.boldType,
  body: {
    padding: theme.spacing(1),
    '& > .MuiList-root .MuiButtonBase-root': {
      paddingLeft: 44
    }
  }
}))

const SelectionComponent = ({
  type,
  clearSelection,
  ...props
}) => {
  switch (type) {
    case 'metric':
      return (
        <>
          <SedaMetricSelect onSelect={clearSelection} />
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
      return <SedaDemographicSelect onSelect={clearSelection} />
    case 'region':
      return <SedaRegionSelect onSelect={clearSelection} />
    case 'filter':
      return <SedaFilterSelect />
    case 'location':
      return <SedaLocationSelect />
    default:
      return null
  }
}

const SedaSelectionPanel = props => {
  const [condensed] = useCondensed()
  const [showHelp] = useHelpVisibility()
  const [selection, setSelection] = useActiveSelection()
  const panelTitle = getPrefixLang(selection, 'PANEL_TITLE')
  const classes = useStyles({ condensed, showHelp })

  const handleCloseSelection = () => setSelection(null)

  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          {panelTitle}
        </Typography>
        <IconButton onClick={handleCloseSelection}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        <SelectionComponent
          type={selection}
          clearSelection={handleCloseSelection}
        />
      </SidePanelBody>
    </SidePanel>
  )
}

export default SedaSelectionPanel
