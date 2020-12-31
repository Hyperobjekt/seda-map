import React from 'react'
import {
  ListItem,
  ListItemText,
  withStyles
} from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'
import { getDemographicIdFromVarName } from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'
import { styles as baseStyles } from './SedaKeyMetricListItem'
import clsx from 'clsx'

const styles = theme => ({
  ...baseStyles(theme),
  padding: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  primary: {
    fontSize: theme.typography.pxToRem(12)
  }
})

const SedaDemographicListItem = ({
  varName,
  value,
  interval,
  classes,
  ...props
}) => {
  const demId = getDemographicIdFromVarName(varName)
  const title = getPrefixLang(demId, 'LABEL_STUDENTS')
  return (
    <ListItem
      classes={{
        root: clsx(classes.root, classes.padding),
        selected: classes.selected
      }}
      {...props}>
      <ListItemText
        classes={{ primary: classes.primary }}
        primary={title}
      />
      <SedaStat
        varName={varName}
        value={value}
        marginOfError={interval}
      />
    </ListItem>
  )
}

SedaDemographicListItem.propTypes = {}

export default withStyles(styles)(SedaDemographicListItem)
