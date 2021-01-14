import React from 'react'
import SedaLogo from './SedaLogo'
import {
  makeStyles,
  Typography,
  Tooltip
} from '@material-ui/core'
import SedaViewControls from './SedaViewControls'
import {
  getMetricLabel,
  getDemographicLabel,
  getRegionLabel,
  getPrefixLang
} from '../../selectors/lang'
import { isGapDemographic } from '../../selectors'
import {
  DetailedTooltip,
  PageHeader
} from '../../../../../shared'
import { useActiveOptions, useActiveView } from '../../hooks'
import { SedaHelpButton } from '../../../help'
import { SedaMenuButton } from '../../../menu'
import { SedaSearch } from '../../../search'
import { useCondensedPanel } from '../../../panels'

const useLogoStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: window.screen.width > 375 ? theme.spacing(4) : theme.spacing(3),
    height: window.screen.width > 375 ? theme.spacing(4) : theme.spacing(3),
    overflow: 'hidden'
  },
  logo: {
    width: 'auto',
    height: window.screen.width > 375 ? theme.spacing(4) : theme.spacing(3)
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

const SettingsIcon = props => (
  <svg {...props} width="19" height="20" viewBox="0 0 19 20" fill="none">
    <line x1="16.425" y1="1.85773e-08" x2="16.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <line x1="9.425" y1="1.85773e-08" x2="9.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <line x1="2.425" y1="1.85773e-08" x2="2.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="16.5" cy="6.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="9.5" cy="14.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="2.5" cy="5.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
  </svg>
)

const HeaderOptionsToggle = () => {
  const classes = useLogoStyles()
  const [, toggleCondensed] = useCondensedPanel()

  return (
    <div className={classes.root} onClick={() => toggleCondensed()}>
      <SettingsIcon className={classes.logo} />
    </div>
  )
}

const useActionStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems:  window.screen.width > 375 ? 'center' : 'unset',
    flexDirection: window.screen.width > 375 ? 'row' : 'row-reverse',
    borderTop: window.screen.width > 375 ? null : '1px solid #E5E5E5'
  },
  searchRoot: {
    width: window.screen.width > 375 ? 180 : 'auto',
    marginRight: window.screen.width > 375 ? theme.spacing(2) : 0,
    '& fieldset': {
      border: window.screen.width > 375 ? null : 0,
    }
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
  const [, , isEmbed] = useActiveView()
  return (!isEmbed &&
    <div className={classes.root} {...props}>
      <SedaSearch
        TextFieldProps={{
          classes: { root: classes.searchRoot }
        }}
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      {
        window.screen.width > 375 && (
          <SedaHelpButton classes={{ root: classes.helpButton }} />
        )
      }
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
// const getFilterLabel = (filters, regionLabel) => {
//   const labels = []
//   if (filters.largest) {
//     labels.push(
//       getLang('HEADER_TITLE_LARGEST', {
//         num: filters.largest,
//         region: regionLabel
//       })
//     )
//   }
//   return labels.length > 0 ? labels.join(' ') : ''
// }

const Subtitle = ({ metric, demographic, region, filters }) => {
  const metricLabel = getMetricLabel(metric)
  // NOTE: removed for filter refactor
  // const regionLabel = getRegionLabel(region)
  // const filterLabel = getFilterLabel(filters, regionLabel)
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
      shown by {MetricLabel} for {studentLabel}
    </>
  )
}

const useHeaderStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  logo: {
    marginRight: window.screen.width > 375 ? theme.spacing(3) : theme.spacing(2)
  },
  heading: {
    fontSize: window.screen.width > 375 ? theme.typography.pxToRem(14) : theme.typography.pxToRem(12),
    textTransform: 'capitalize',
    whiteSpace: window.screen.width > 375 ? 'nowrap' : 'wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  subheading: {
    fontSize: window.screen.width > 375 ? theme.typography.pxToRem(12) : theme.typography.pxToRem(11),
    color: theme.palette.text.secondary
  },
  toolbar: {
    paddingLeft: window.screen.width > 375 ? theme.spacing(3) : theme.spacing(2),
    paddingRight: window.screen.width > 375 ? theme.spacing(3) : theme.spacing(6)
  }
}))

const SedaHeader = props => {
  const [metricId, demId, regionId] = useActiveOptions()
  // const [filters] = useFilters()
  // const stateName = filters.prefix
  //   ? getStateName(filters.prefix)
  //   : undefined
  const heading = getTitleFromSelections({
    metric: metricId,
    demographic: demId,
    region: regionId,
    // TODO: parent location removed in filter refactor, need to re-add
    parentLocation: undefined
  })
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      LogoComponent={window.screen.width > 375 ? <HeaderLogo /> : <HeaderOptionsToggle />}
      ActionsComponent={<HeaderActions />}
      {...props}>
      <Typography className={classes.heading} variant="h1">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="body2">
        <Subtitle
          metric={metricId}
          demographic={demId}
          region={regionId}
        />
      </Typography>
    </PageHeader>
  )
}

export default SedaHeader
