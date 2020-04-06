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
import {
  getLang,
  getMetricLabel,
  getDemographicLabel,
  getRegionLabel,
  getPrefixLang
} from '../../../../shared/selectors/lang'
import { isGapDemographic } from '../../../../shared/selectors'
import DetailedTooltip from '../base/DetailedTooltip'
import { useActiveOptionIds, useFilters } from '../../hooks'
import { getStateName } from '../../../../shared/selectors/states'

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
  const isGap = isGapDemographic(demographic)
  const metricConcept = getPrefixLang(metric, `LABEL_CONCEPT`)
  return isGap
    ? `${metricConcept} Gaps in ${parentLocation} ${getRegionLabel(
        region
      )}`
    : `${metricConcept} in ${parentLocation} ${getRegionLabel(
        region
      )}`
}

/**
 * Returns text to use in the header subtitle for filters
 * (e.g. in the largest 50 Counties in California)
 * @param {object} filters
 * @param {string} regionLabel
 * @param {function} idToName (function to transform id to name)
 */
const getFilterLabel = (filters, regionLabel) => {
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
  const metricLabel = getMetricLabel(metric)
  const regionLabel = getRegionLabel(region)
  const filterLabel = getFilterLabel(filters, regionLabel)
  const metricTooltip = getMetricLabel(metric, 'HINT')
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
    demographic,
    'LABEL_STUDENTS'
  )
  const isGap = isGapDemographic(demographic)
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
    marginRight: theme.spacing(3)
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
  },
  toolbar: {
    paddingLeft: theme.spacing(3)
  }
}))

const SedaHeader = ({ onMenuClick }) => {
  const [metricId, demId, regionId] = useActiveOptionIds()
  const [filters] = useFilters()
  const stateName = filters.prefix
    ? getStateName(filters.prefix)
    : undefined
  const heading = getTitleFromSelections({
    metric: metricId,
    demographic: demId,
    region: regionId,
    parentLocation: stateName
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
          metric={metricId}
          demographic={demId}
          region={regionId}
          filters={filters}
        />
      </Typography>
    </PageHeader>
  )
}

SedaHeader.propTypes = {}

export default SedaHeader
