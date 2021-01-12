import React from 'react'
import PropTypes from 'prop-types'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  withStyles
} from '@material-ui/core'
import {
  BasicSidePanel,
  SidePanelList
} from '../../../../shared'
import { MetricIcon } from '../../../icons'
import SedaMetricSelect from '../../controls/SedaMetricSelect'
import PanelDescription from './PanelDescription'

const styles = theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4,
    '& .MuiListItem-button': {
      borderRadius: theme.shape.borderRadius
    },
    '& .MuiListItemText-prmary': {
      textTransform: 'capitalize'
    },
    '& .MuiListItemText-secondary': {
      fontSize: theme.typography.pxToRem(12)
    },
    '& .MuiListItemSecondaryAction-root': {
      fontSize: theme.spacing(3),
      pointerEvents: 'none',
      right: theme.spacing(3)
    },
    '& .Mui-selected .MuiListItemSecondaryAction-root': {
      color: theme.palette.primary.main
    }
  }
})

const SedaMetricPanelItem = ({
  value,
  selected,
  children,
  ...props
}) => {
  const secondary = getPrefixLang(value, 'LABEL_REFLECTS')

  return (
    <ListItem button selected={selected} {...props}>
      <ListItemText primary={children} secondary={secondary} />
      <ListItemSecondaryAction>
        <MetricIcon metricId={value} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

/**
 * Side panel for metric selection
 */
const SedaMetricPanel = ({ classes, onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('metric', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <>
        <SedaMetricSelect
          className={classes.root}
          component={SidePanelList}
          itemComponent={SedaMetricPanelItem}
          onSelect={onClose}
          aria-label="educational opportunity metric selection"
        />
        <PanelDescription>
          {getLang('PANEL_DESCRIPTION_METRICS')}
        </PanelDescription>
      </>
    </BasicSidePanel>
  )
}

SedaMetricPanel.propTypes = {
  onClose: PropTypes.func
}

export default withStyles(styles)(SedaMetricPanel)
