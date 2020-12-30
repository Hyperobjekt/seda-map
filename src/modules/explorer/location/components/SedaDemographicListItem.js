import React from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemText, withStyles } from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'
import { getDemographicIdFromVarName } from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'
import { styles } from "./SedaKeyMetricListItem"

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
    <ListItem  classes={{root: classes.root, selected: classes.selected}} {...props}>
      <ListItemText primary={title} />
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
