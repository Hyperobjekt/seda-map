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
    top: theme.spacing(-8),
    minHeight: theme.spacing(9),
    right: 0,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: -56,
      position: 'static',
      width: `calc(100vw - 32px)`,
      marginLeft: 8,
      flexDirection: 'row'
    }
  },
  title: {
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 1.25,
    whiteSpace: 'normal',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(13)
    }
  },
  footnote: {
    fontSize: theme.typography.pxToRem(12),
    marginTop: 2,
    whiteSpace: 'normal',
    maxWidth: '62em',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(13)
    }
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
    demographic:
      demographic === 'all'
        ? ' '
        : getPrefixLang(demographic, 'LABEL'),
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
  if (getMetricIdFromVarName(yVar) === 'avg') return 'AVG'
  return 'DEFAULT'
}

const getScatterplotLang = (key, chartType, context) => {
  const isTitle = key.indexOf('TITLE') > -1
  // title case metrics if this is a title
  if (isTitle) {
    context['metric'] = titleCase(context['metric'])
    context['secondary'] = titleCase(context['secondary'])
  }
  if (chartType === 'VS') return getLang(key + '_VS', context)
  if (chartType === 'GAP') return getLang(key + '_GAP', context)
  // AVG chart needs metric re-wording
  if (chartType === 'AVG' && isTitle) return getLang(key + '_AVG', context)
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
  const isBelowLarge = useMediaQuery(
    theme.breakpoints.down('lg')
  )
  const compact =
    useMediaQuery(theme.breakpoints.down('sm')) ||
    (isSplit && isBelowLarge)
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
