import React from 'react'
import PropTypes from 'prop-types'
import { PageHeader } from '../../../../base/components/Page'
import SedaLogo from './SedaLogo'
import {
  makeStyles,
  Typography,
  Tooltip
} from '@material-ui/core'
import SedaHelpButton from './SedaHelpButton'
import SedaMenuButton from './SedaMenuButton'
import SedaViewControls from './SedaViewControls'
import SearchInput from '../../../../base/components/SearchInput'
import useDataOptions from '../../hooks/useDataOptions'
import {
  getLang,
  getMetricLabel,
  getDemographicLabel,
  getRegionLabel,
  getPrefixLang
} from '../../../../shared/selectors/lang'
import { isGapDemographic } from '../../../../shared/selectors'
import DetailedTooltip from '../base/DetailedTooltip'

const useLogoStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden'
  },
  logo: {
    width: 'auto',
    height: theme.spacing(4)
  }
}))

const HeaderLogo = props => {
  const classes = useLogoStyles()
  return (
    <a className={classes.root} href="/">
      <SedaLogo className={classes.logo} />
    </a>
  )
}

const useActionStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  searchRoot: {
    width: 180,
    marginRight: theme.spacing(2)
  },
  viewControls: {
    marginRight: theme.spacing(2)
  },
  helpButton: {
    marginRight: theme.spacing(2)
  }
}))

const HeaderActions = ({ ...props }) => {
  const classes = useActionStyles()
  return (
    <div className={classes.root} {...props}>
      <SearchInput
        classes={{ root: classes.searchRoot }}
        condensed
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      <SedaHelpButton classes={{ root: classes.helpButton }} />
      <SedaMenuButton />
    </div>
  )
}

const useSubtitleStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    textDecorationColor: theme.palette.divider,
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}))

/**
 * Returns the page heading based on selections
 */
const getTitleFromSelections = ({
  metric,
  demographic,
  region,
  parentLocation = 'U.S.'
}) => {
  const isGap = isGapDemographic(demographic.id)
  const metricConcept = getPrefixLang(metric.id, `LABEL_CONCEPT`)
  return isGap
    ? `${metricConcept} Gaps in ${parentLocation} ${
        region.label
      }`
    : `${metricConcept} in ${parentLocation} ${region.label}`
}

/**
 * Returns text to use in the header subtitle for filters
 * (e.g. in the largest 50 Counties in California)
 * @param {object} filters
 * @param {string} regionLabel
 * @param {function} idToName (function to transform id to name)
 */
const getFilterLabel = (filters, regionLabel, idToName) => {
  const labels = []
  if (filters.largest) {
    labels.push(
      getLang('HEADER_TITLE_LARGEST', {
        num: filters.largest,
        region: regionLabel
      })
    )
  }
  return labels.length > 0 ? labels.join(' ') : ''
}

const Subtitle = ({ metric, demographic, region, filters }) => {
  const metricLabel = getMetricLabel(metric.id)
  const regionLabel = getRegionLabel(region.id)
  const getNameForId = useDataOptions(
    state => state.getNameForId
  )
  const filterLabel = getFilterLabel(
    filters,
    regionLabel,
    getNameForId
  )
  const metricTooltip = getMetricLabel(metric.id, 'HINT')
  const classes = useSubtitleStyles()
  const MetricLabel = (
    <Tooltip
      title={
        <DetailedTooltip
          primary={metricTooltip}
          hint={`click for more info about ${metricLabel}`}
        />
      }
      placement="bottom"
      arrow>
      <span className={classes.root}>{metricLabel}</span>
    </Tooltip>
  )
  const studentLabel = getDemographicLabel(
    demographic.id,
    'LABEL_STUDENTS'
  )
  const isGap = isGapDemographic(demographic.id)
  return isGap ? (
    <>
      shown by {studentLabel}' {MetricLabel}
    </>
  ) : (
    <>
      shown by {MetricLabel} for {studentLabel} {filterLabel}
    </>
  )
}

const useHeaderStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  subheading: {
    color: theme.palette.text.secondary
  }
}))

const SedaHeader = ({ onMenuClick }) => {
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const region = useDataOptions(state => state.region)
  const filters = useDataOptions(state => state.filters)
  const getNameForId = useDataOptions(
    state => state.getNameForId
  )
  const heading = getTitleFromSelections({
    metric,
    demographic,
    region,
    parentLocation: filters.prefix
      ? getNameForId(filters.prefix)
      : undefined
  })
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      LogoComponent={<HeaderLogo />}
      ActionsComponent={<HeaderActions />}>
      <Typography className={classes.heading} variant="h1">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="body2">
        <Subtitle
          {...{ metric, demographic, region, filters }}
        />
      </Typography>
    </PageHeader>
  )
}

SedaHeader.propTypes = {}

export default SedaHeader
