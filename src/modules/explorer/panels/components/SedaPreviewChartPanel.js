import React from 'react'
import { ExpansionPanel } from '../../../../shared'
import { makeStyles, Typography } from '@material-ui/core'
import { ExpandIcon, CloseIcon } from '../../../icons'
import { useCurrentVars } from '../../app/hooks'
import { getPreviewChartTitle } from '../../scatterplot/lang'
import { SedaScatterplotPreview } from '../../scatterplot'
import useCondensedPanel from '../hooks/useCondensedPanel'
import usePanelChartVisible from '../hooks/usePanelChartVisible'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: props =>
      props.detached ? theme.shadows[1] : 'none',
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
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'capitalize'
  },
  summary: {
    '&:after': {
      background: 'transparent'
    }
  }
}))

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
      expandIcon={
        detached ? (
          <CloseIcon style={{ fontSize: 16 }} />
        ) : (
          <ExpandIcon />
        )
      }
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
      </div>
    </ExpansionPanel>
  )
}

export default SedaPreviewChartPanel
