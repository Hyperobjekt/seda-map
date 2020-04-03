import React from 'react'
import PropTypes from 'prop-types'
import { ExpansionPanel } from '../../../../base/components/Panels'
import { ScatterplotPreview } from '../scatterplot'
import { makeStyles, Typography } from '@material-ui/core'
import { getPreviewChartTitle } from '../../../../shared/selectors/lang'
import useDataOptions from '../../hooks/useDataOptions'
import useUiStore from '../../hooks/useUiStore'
import CloseIcon from '../../../icons/components/CloseIcon'
import { ExpandIcon } from '../../../icons'
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

const PreviewChartPanel = ({ ...props }) => {
  const detached = useUiStore(state => state.condensed)
  const showChart = useUiStore(state => state.showChart)
  const setShowChart = useUiStore(state => state.setShowChart)
  const { xVar, yVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const classes = useStyles({ detached })
  return (
    <ExpansionPanel
      defaultExpanded
      expanded={showChart}
      classes={classes}
      title={getPreviewChartTitle(xVar, yVar)}
      onChange={(e, expanded) => {
        console.log('show chchc', e, expanded)
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
        <ScatterplotPreview />
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

PreviewChartPanel.propTypes = {}

export default PreviewChartPanel
