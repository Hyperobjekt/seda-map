import React from 'react'
import PropTypes from 'prop-types'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles
} from '@material-ui/core'
import { MetricIcon } from '../../../icons'
import { getDescriptionForVarName, getPrefixLang } from '../../app/selectors/lang'
import { getMetricIdFromVarName } from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'
import { titleCase } from '../../../../shared/utils'

export const styles = (theme) => ({
  root: {
    margin: theme.spacing(0,1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    borderRadius: theme.shape.borderRadius,
    "&$selected": {
      backgroundColor: theme.palette.primary.highlight,
      boxShadow: `inset 0 0 0 1px ${theme.palette.primary.light}`
    }
  },
  selected: {
    "& $avatar": {
      color: theme.palette.primary.main
    }
  },
  avatar: {
    display: "flex",
    fontSize: 24,
    minWidth: 40
  },
  text: {
    marginRight: theme.spacing(1)
  },
  textPrimary: {
    fontWeight: "bold"
  }
})

const SedaKeyMetricListItem = ({
  varName,
  value,
  interval,
  classes,
  ...props
}) => {
  const metricId = getMetricIdFromVarName(varName)
  const title = titleCase(getPrefixLang(metricId, 'LABEL'))
  const description = <span dangerouslySetInnerHTML={{__html: getDescriptionForVarName(varName, value)}} />
  return (
    <ListItem classes={{root: classes.root, selected: classes.selected}} {...props}>
      <ListItemAvatar className={classes.avatar}>
          <MetricIcon metricId={metricId} />
      </ListItemAvatar>
      <ListItemText classes={{root: classes.text, primary: classes.textPrimary}} primary={title} secondary={description} />
      <SedaStat
        varName={varName}
        value={value}
        marginOfError={interval}
      />
    </ListItem>
  )
}

SedaKeyMetricListItem.propTypes = {}

export default withStyles(styles)(SedaKeyMetricListItem)
