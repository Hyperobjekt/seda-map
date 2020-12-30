import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core'
import { MetricIcon } from '../../../icons'
import { getPrefixLang } from '../../app/selectors/lang'
import { getMetricIdFromVarName } from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'

const SedaKeyMetricListItem = ({
  varName,
  value,
  interval,
  ...props
}) => {
  const metricId = getMetricIdFromVarName(varName)
  const title = getPrefixLang(metricId, 'LABEL')
  const description = 'this is a placeholder description'
  return (
    <ListItem {...props}>
      <ListItemAvatar>
        <Avatar>
          <MetricIcon metricId={metricId} />
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={title} secondary={description} />
      <SedaStat
        varName={varName}
        value={value}
        marginOfError={interval}
      />
    </ListItem>
  )
}

SedaKeyMetricListItem.propTypes = {}

export default SedaKeyMetricListItem
