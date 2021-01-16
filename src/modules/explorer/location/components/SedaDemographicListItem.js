import React from 'react'
import {
  ListItem,
  ListItemText,
  withStyles
} from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'
import {
  getDemographicIdFromVarName,
  getMetricIdFromVarName,
  isGapVarName,
  isUnavailable
} from '../../app/selectors'
import SedaStat from '../../stats/SedaStat'
import { styles as baseStyles } from './SedaKeyMetricListItem'
import clsx from 'clsx'
import { DivergingBar } from '../../../../shared/components/Stats'

const styles = theme => ({
  ...baseStyles(theme),
  padding: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  primary: {
    fontSize: theme.typography.pxToRem(12)
  },
  bar: {
    position: 'absolute',
    right: theme.spacing(10)
  },
  divider: {
    borderBottom: 'none',
    marginBottom: theme.spacing(2),
    position: 'relative',
    '&:after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: theme.spacing(-1),
      height: 1,
      backgroundColor: theme.palette.divider
    }
  }
})

const SedaDemographicListItem = ({
  varName,
  value,
  maxValue,
  interval,
  classes,
  ...props
}) => {
  const metricId = getMetricIdFromVarName(varName)
  const demId = getDemographicIdFromVarName(varName)
  const isGap = isGapVarName(varName)
  const title = getPrefixLang(demId, demId === 'all' ? 'LABEL_LOCATION_STUDENTS' : 'LABEL_STUDENTS')

  // learning rates must offset from 1 for non-gap value
  const barValue =
    metricId === 'grd' && !isGap ? value - 1 : value

  return (
    <ListItem
      classes={{
        root: clsx(classes.root, classes.padding),
        selected: classes.selected,
        divider: classes.divider
      }}
      {...props}>
      <ListItemText
        classes={{ primary: classes.primary }}
        primary={title}
      />
      {!isUnavailable(value) && (
        <DivergingBar
          className={classes.bar}
          value={barValue / maxValue}
          invert={isGap}
        />
      )}
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
