import React from 'react'
import {
  Typography,
  useMediaQuery,
  useTheme,
  withStyles
} from '@material-ui/core'
import clsx from 'clsx'
import {
  getDemographicForVarNames,
  getGapDemographics,
  getMetricIdFromVarName,
  isGapVarName,
  isVersusFromVarNames
} from '../../app/selectors'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import { titleCase } from '../../../../shared/utils'
import HintIconButton from '../../../../shared/components/Buttons/HintIconButton'
import useSplitViewActive from '../../app/hooks/useSplitViewActive'

const styles = theme => ({
  root: {
    position: 'absolute',
    left: theme.spacing(0),
    top: theme.spacing(-6),
    right: 0,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.25,
    whiteSpace: 'normal'
  },
  footnote: {
    marginTop: theme.spacing(0.5),
    whiteSpace: 'normal',
    maxWidth: '62em'
  }
})

const getScatterplotContext = (xVar, yVar, region, type) => {
  const metric = getMetricIdFromVarName(yVar)
  const secondary = getMetricIdFromVarName(xVar)
  const demographic = getDemographicForVarNames(xVar, yVar)
  const isGap = type === 'GAP'
  const isVs = type === 'VS'
  const dems = getGapDemographics(demographic)
  return {
    opportunityType: getPrefixLang(metric, 'LABEL_CONCEPT'),
    demographic: getPrefixLang(demographic, 'LABEL_STUDENTS'),
    dem1: (isGap || isVs) && getPrefixLang(dems[0], 'LABEL'),
    dem2: (isGap || isVs) && getPrefixLang(dems[1], 'LABEL'),
    metric: getPrefixLang(metric, 'LABEL'),
    secondary: getPrefixLang(secondary, 'LABEL'),
    region: getPrefixLang(region, 'LABEL')
  }
}

const getScatterplotType = (xVar, yVar) => {
  if (isVersusFromVarNames(xVar, yVar)) return 'VS'
  if (isGapVarName(yVar)) return 'GAP'
  return 'DEFAULT'
}

const getScatterplotLang = (key, chartType, context) => {
  // title case metrics if this is a title
  if (key.indexOf('TITLE') > -1) {
    context['metric'] = titleCase(context['metric'])
    context['secondary'] = titleCase(context['secondary'])
  }
  if (chartType === 'VS') return getLang(key + '_VS', context)
  if (chartType === 'GAP') return getLang(key + '_GAP', context)
  return getLang(key, context)
}

const SedaScatterplotHeader = ({
  classes,
  className,
  xVar,
  yVar,
  region,
  children,
  ...props
}) => {
  const theme = useTheme()
  const isSplit = useSplitViewActive()
  const compact = useMediaQuery(theme.breakpoints.down('sm')) || (isSplit && theme.breakpoints.down('lg'))
  const type = getScatterplotType(xVar, yVar)
  const context = getScatterplotContext(xVar, yVar, region, type)
  const title = getScatterplotLang(
    'SCATTERPLOT_TITLE',
    type,
    context
  )
  const description = getScatterplotLang(
    'SCATTERPLOT_DESCRIPTION',
    type,
    context
  )
  return (
    <div
      className={clsx(
        'scatterplot__header',
        classes.root,
        className
      )}
      {...props}>
      <Typography variant="h6" className={classes.title}>
        {title}{' '}
        {compact && <HintIconButton title={description} />}
      </Typography>
      {!compact && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.footnote}>
          {description}
        </Typography>
      )}
      {children}
    </div>
  )
}

SedaScatterplotHeader.propTypes = {}

export default withStyles(styles)(SedaScatterplotHeader)
