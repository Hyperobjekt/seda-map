import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import SelectButton from './SelectButton'
import { getLang } from '../../../shared/selectors/lang'
import KeyMetricList from './KeyMetricList'
import SecondaryMetricList from './SecondaryMetricList'
import { onRouteUpdates } from '../../../actions'
import { isGapDemographic } from '../../../shared/selectors'
import { getStatePropByAbbr } from '../../../shared/selectors/states'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}))

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

/** Returns the subtitle for the provided vars */
const getSubline = (demographic, region, highlightedState) => {
  const state =
    getStatePropByAbbr(highlightedState, 'full') || 'U.S.'
  const isGap = isGapDemographic(demographic)
  return getLang('MOBILE_SUBLINE', {
    place: state,
    region: region,
    demographic: isGap
      ? getLang('LABEL_SHORT_' + demographic) + ' students'
      : getLang('LABEL_' + demographic) + ' students'
  })
}

const DataOptionsDialog = ({
  metric,
  demographic,
  region,
  highlightedState,
  onApplySettings
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [keyMetric, setKeyMetric] = React.useState(metric)
  const [dialogDem, setDemographic] = React.useState(demographic)
  const [dialogRegion, setRegion] = React.useState(region)
  const [dialogState, setHighlightedState] = React.useState(
    highlightedState
  )

  const resetOptions = () => {
    setKeyMetric(metric)
    setDemographic(demographic)
    setRegion(region)
    setHighlightedState(highlightedState)
  }

  const handleClickOpen = () => {
    setOpen(true)
    resetOptions()
  }

  /** Apply the settings that have changed on save */
  const handleSave = () => {
    setOpen(false)
    const updates = {}
    if (keyMetric !== metric) {
      updates['metric'] = keyMetric
    }
    if (dialogDem !== demographic) {
      updates['demographic'] = dialogDem
    }
    if (dialogRegion !== region) {
      updates['region'] = dialogRegion
    }
    if (dialogState !== highlightedState) {
      updates['highlightedState'] = dialogState
    }
    onApplySettings(updates)
  }

  /** Reset settings on cancel */
  const handleCancel = () => {
    setOpen(false)
    resetOptions()
  }

  return (
    <div>
      <SelectButton
        text={getLang('TAB_CONCEPT_' + metric)}
        subtext={getSubline(
          demographic,
          region,
          highlightedState
        )}
        onClick={handleClickOpen}
      />
      <Dialog
        fullScreen
        open={open}
        onClose={handleCancel}
        TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCancel}
              aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Data Options
            </Typography>
            <Button color="inherit" onClick={handleSave}>
              Apply Changes
            </Button>
          </Toolbar>
        </AppBar>
        <KeyMetricList
          metric={keyMetric}
          onMetricChange={m => {
            setKeyMetric(m)
          }}
        />
        <Divider />
        <SecondaryMetricList
          demographic={dialogDem}
          region={dialogRegion}
          highlightedState={dialogState}
          onDemographicChange={setDemographic}
          onRegionChange={setRegion}
          onHighlightedStateChange={setHighlightedState}
        />
      </Dialog>
    </div>
  )
}

DataOptionsDialog.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  highlightedState: PropTypes.string,
  onApplySettings: PropTypes.func
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { region, demographic, metric, highlightedState }
    }
  }
) => ({
  region,
  demographic,
  metric,
  highlightedState
})

const mapDispatchToProps = dispatch => ({
  onApplySettings: updates => {
    dispatch(onRouteUpdates(updates))
  }
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DataOptionsDialog)
