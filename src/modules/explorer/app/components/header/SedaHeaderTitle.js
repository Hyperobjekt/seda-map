import React from 'react'
import {
  getLang,
  getPrefixLang,
  splitLang
} from '../../selectors/lang'
import {
  ButtonBase,
  IconButton,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core'
import { useActiveOptions } from '../../hooks'
import {
  getGapDemographics,
  isGapDemographic
} from '../../selectors'
import clsx from 'clsx'
import { DetailedTooltip } from '../../../../../shared'
import useActivePanel from '../../../panels/hooks/useActivePanel'
import useFilterLocationName from '../../../filters/hooks/useFilterLocationName'
import ClearFilterIcon from '../../../../icons/components/ClearFilterIcon'
import useFilterStore from '../../../../filters'
import { useActiveFilters } from '../../../filters'

const InterpolateComponents = ({ text, components }) => {
  const chunks = splitLang(text)
  return (
    <>
      {chunks.map(a => {
        // if this chunk is not a replacement
        if (a && a[0] !== '$')
          return <React.Fragment key={a}>{a}</React.Fragment>
        // strip the templating portions so only the key remains
        a = a.replace('$[', '')
        a = a.replace(']', '')
        // return the value from the params object if it has a corresponding key
        if (components[a])
          return (
            <React.Fragment key={a}>
              {components[a]}
            </React.Fragment>
          )
        // return the key if there is no match
        return <React.Fragment key={a}>{a}</React.Fragment>
      })}
    </>
  )
}

const styles = theme => ({
  root: {},
  title: {
    fontSize: theme.typography.pxToRem(14),
    textTransform: 'capitalize'
  },
  subtitle: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
    // hide on mobile
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  button: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    color: theme.palette.primary.main
  }
})

const getLabelPrefix = (type, value) => {
  switch (type) {
    case 'region':
      return `LABEL_SINGULAR`
    case 'demographic':
      return `LABEL_STUDENTS`
    default:
      return `LABEL`
  }
}

const getTooltipLang = (type, value) => {
  const isGap = type === 'demographic' && isGapDemographic(value)
  const gapDems = isGap
    ? getGapDemographics(value)
    : [value, value]
  switch (type) {
    case 'metric':
      return getPrefixLang(value, 'HINT')
    case 'demographic':
      return getLang(
        isGap ? 'HINT_GAP_DEMOGRAPHIC' : 'HINT_DEMOGRAPHIC',
        {
          dem1: getPrefixLang(gapDems[0]),
          dem2: getPrefixLang(gapDems[1])
        }
      )
    default:
      return getPrefixLang(type, 'HINT')
  }
}

const SedaClearFilterButton = ({ count }) => {
  // function to clear filters
  const clearFilters = useFilterStore(
    state => state.clearFilters
  )
  const handleClearFilter = () => {
    clearFilters()
  }

  const hintText =
    count === 1
      ? `There is currently one filter applied to the data.`
      : `There are currently ${count} filters applied to the data.`
  return (
    <Tooltip
      title={
        <DetailedTooltip
          primary={hintText}
          hint={`click to clear all filters`}
        />
      }
      placement="bottom"
      arrow>
      <IconButton
        size="small"
        style={{ margin: `-8px 0 -12px` }}
        onClick={handleClearFilter}>
        <ClearFilterIcon style={{ fontSize: 20 }} />
      </IconButton>
    </Tooltip>
  )
}

const SedaOptionButton = ({ type, value, ...props }) => {
  const [, setSelection] = useActivePanel()
  const labelPrefix = getLabelPrefix(type, value)
  const label = getPrefixLang(value, labelPrefix)
  const tooltipText = getTooltipLang(type, value)
  const typeLabel = getPrefixLang(type, 'LABEL')

  const handleClick = () => {
    setSelection(type)
  }

  return (
    <Tooltip
      title={
        <DetailedTooltip
          primary={tooltipText}
          hint={`click to change ${typeLabel}`}
        />
      }
      placement="bottom"
      arrow
      {...props}>
      <ButtonBase onClick={handleClick}>{label}</ButtonBase>
    </Tooltip>
  )
}

const SedaHeaderTitle = ({ classes, className, ...props }) => {
  const [metricId, demId, regionId] = useActiveOptions()
  const filterLocation = useFilterLocationName()
  const isGap = isGapDemographic(demId)
  const filters = useActiveFilters()
  const filterCount = filters.filter(f => f[0] !== 'sort').length

  // context strings to inject in title
  const titleContext = {
    opportunityType: getPrefixLang(metricId, `LABEL_CONCEPT`),
    filterLocation
  }
  // get title string
  const titleKey = isGap ? `APP_TITLE_GAP` : `APP_TITLE`
  const title = getLang(titleKey, titleContext)

  // components to inject into the subtitle string
  const subtitleComponents = {
    region: (
      <SedaOptionButton
        className={classes.button}
        type="region"
        value={regionId}
      />
    ),
    demographic: (
      <SedaOptionButton
        className={classes.button}
        type="demographic"
        value={demId}
      />
    ),
    metric: (
      <SedaOptionButton
        className={classes.button}
        type="metric"
        value={metricId}
      />
    )
  }
  // get subtitle string
  const subtitleKey = isGap ? `APP_SUBTITLE_GAP` : `APP_SUBTITLE`
  const subtitle = getLang(subtitleKey)

  return (
    <div className={clsx(classes.root, className)} {...props}>
      <Typography className={classes.title} variant="h1">
        {title}{' '}
        {Boolean(filterCount) && (
          <SedaClearFilterButton count={filterCount} />
        )}
      </Typography>
      <Typography className={classes.subtitle} variant="body2">
        <InterpolateComponents
          text={subtitle}
          components={subtitleComponents}
        />
      </Typography>
    </div>
  )
}

SedaHeaderTitle.propTypes = {}

export default withStyles(styles)(SedaHeaderTitle)
