import React, { useState } from 'react'
import { ExpansionPanel } from '../../../../shared'
import { makeStyles, Typography } from '@material-ui/core'
import { ExpandIcon } from '../../../icons'
import { useCurrentVars } from '../../app/hooks'
import { SedaScatterplotPreview } from '../../scatterplot'
import useCondensedPanel from '../hooks/useCondensedPanel'
import usePanelChartVisible from '../hooks/usePanelChartVisible'
import {
  getDemographicLabel,
  getMetricLabel,
  isVersusFromVarNames
} from '../../app/selectors'
import { getLang } from '../../app/selectors/lang'
import SedaViewControls from '../../app/components/header/SedaViewControls'
import { animated, useSpring } from 'react-spring'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: props =>
      props.detached ? `var(--shadow1)` : 'none',
    overflow: 'hidden',
    borderRadius: props =>
      props.detached ? theme.shape.borderRadius : 0,
    '&.Mui-expanded': {
      '& .MuiExpansionPanelSummary-root': {
        minHeight: theme.spacing(5)
      },
      '& .MuiExpansionPanelSummary-content': {
        margin: 0
      },
      '& .MuiExpansionPanelSummary-expandIcon': {
        padding: '0 8px'
      }
    }
  },
  details: { padding: 0 },
  heading: {
    fontSize: theme.typography.pxToRem(14),
    textTransform: 'capitalize'
  },
  summary: {
    '&:after': {
      background: 'transparent'
    }
  }
}))

/**
 * Returns the title for the preview chart
 * @param {*} xVar
 * @param {*} yVar
 */
const getPreviewChartTitle = (xVar, yVar) => {
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const langKey = isVersus
    ? 'LABEL_PREVIEW_CHART_GAP'
    : 'LABEL_PREVIEW_CHART'
  const langContext = {
    opportunityType: getMetricLabel(yVar, 'LABEL_CONCEPT'),
    secondary: getMetricLabel(xVar),
    dem1: getDemographicLabel(yVar),
    dem2: getDemographicLabel(xVar)
  }
  return getLang(langKey, langContext)
}

const useChartOverlayStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: theme.spacing(3),
    width: `calc(100% - ${theme.spacing(6)}px)`,
    height: `calc(100% - ${theme.spacing(3)}px)`,
    overflow: 'hidden'
  },
  inner: {
    padding: theme.spacing(3),
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundImage:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.8) 60%, rgba(255, 255, 255, 0))',
    '& button': {
      background: 'white'
    },
    '& button:hover': {
      background: 'white'
    },
    '& button:first-child': {
      display: 'none'
    },
    '& button:nth-child(2)': {
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3
    }
  },
  text: {
    ...theme.mixins.boldType,
    textAlign: 'center',
    maxWidth: 160
  }
}))

const ChartCalloutOverlay = () => {
  const classes = useChartOverlayStyles()
  const [visible, setVisible] = useState(false)
  const styles = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible
      ? `translate3d(0, 0, 0)`
      : `translate3d(0, 100%, 0)`
  })
  const onMouseEnter = () => setVisible(true)
  const onMouseLeave = () => setVisible(false)

  return (
    <div
      className={classes.root}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <animated.div className={classes.inner} style={styles}>
        <p className={classes.text}>
          {getLang('LABEL_PREVIEW_CHANGE_VIEW')}
        </p>
        <SedaViewControls />
      </animated.div>
    </div>
  )
}

const SedaPreviewChartPanel = ({ ...props }) => {
  /** panel is detached if in condensed mode */
  const [detached] = useCondensedPanel()
  /** state of preview chart visibility */
  const [showChart, setShowChart] = usePanelChartVisible()
  /** scatterplot variables */
  const [xVar, yVar] = useCurrentVars('chart')
  /** object containing class names */
  const classes = useStyles({ detached })

  return (
    <ExpansionPanel
      defaultExpanded
      expanded={showChart}
      classes={classes}
      title={getPreviewChartTitle(xVar, yVar)}
      onChange={(e, expanded) => {
        setShowChart(expanded)
      }}
      expandIcon={<ExpandIcon />}
      {...props}>
      <div
        style={{
          position: 'relative',
          padding: detached
            ? '0px 24px 24px 24px'
            : '0px 24px 24px 24px'
        }}>
        <SedaScatterplotPreview />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 24,
            padding: '0 4px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ccc'
          }}>
          <span
            style={{
              height: 2,
              width: 12,
              background: '#888',
              marginRight: 4
            }}
          />
          <Typography style={{ fontSize: 10 }} variant="caption">
            national average
          </Typography>
        </div>
        <ChartCalloutOverlay />
      </div>
    </ExpansionPanel>
  )
}

export default SedaPreviewChartPanel
