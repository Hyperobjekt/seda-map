import React from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemText } from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'
import { getDemographicIdFromVarName } from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'

const SedaDemographicListItem = ({
  varName,
  value,
  interval,
  ...props
}) => {
  const demId = getDemographicIdFromVarName(varName)
  const title = getPrefixLang(demId, 'LABEL')
  return (
    <ListItem {...props}>
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

export default SedaDemographicListItem
