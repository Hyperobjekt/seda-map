import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { getLang } from '../../app/selectors/lang'
// import { getScatterplotVars } from '../selectors'
import { InputAdornment, IconButton } from '@material-ui/core'
import CopyIcon from '@material-ui/icons/FileCopy'
import copy from 'copy-to-clipboard'
import { onShare } from '../actions'
import {
  useEmbedDialogVisibility,
} from '..'
import { useAppContext, useDataOptions } from '../../app/hooks'
import { useMapViewport } from '../../../map'
import shallow from 'zustand/shallow'
import { filterArrayToString } from '../../routing/selectors'
import { useFilters } from '../../filters'

const BASE_URL = `${window.location.origin}${
  window.location.pathname
}`

const getSecondaryChartsForDemographic = dem => {
  switch (dem) {
    case 'wb':
    case 'wh':
      return ['ses', 'seg', 'min']
    case 'pn':
    case 'pnp':
      return ['seg']
    default:
      return null
  }
}

const getMapEmbedLink = ({
  region,
  demographic,
  secondary,
  metric,
  zoom,
  latitude,
  longitude,
  locations,
  filters
}) => {
  return (locations && locations.length > 0)
    ? `${BASE_URL}#/embed/map/${filterArrayToString(filters)}/${region}/${metric}/${secondary}/${demographic}/${zoom}/${latitude}/${longitude}/${locations}`
    : `${BASE_URL}#/embed/map/${filterArrayToString(filters)}/${region}/${metric}/${secondary}/${demographic}/${zoom}/${latitude}/${longitude}`
}

const getChartEmbedLink = ({
  region,
  metric,
  secondary,
  demographic,
  locations,
  filters,
  zoom,
  latitude,
  longitude,
}) => {
  return (locations && locations.length > 0)
    ? `${BASE_URL}#/embed/chart/${filterArrayToString(filters)}/${region}/${metric}/${secondary}/${demographic}/${zoom}/${latitude}/${longitude}/${locations}`
    : `${BASE_URL}#/embed/chart/${filterArrayToString(filters)}/${region}/${metric}/${secondary}/${demographic}/${zoom}/${latitude}/${longitude}`
}

const getSecondaryChartEmbedLink = ({
  region,
  demographic,
  metric,
  locations,
  secondary,
  filters,
  zoom,
  latitude,
  longitude,
}) => {
  // let { xVar, yVar, zVar } = getMapVars(
  //   region,
  //   metric,
  //   demographic
  // )
  // if (xVar.split('_')[0] === 'pn') {
  //   // HACK: poor / non-poor gap in school poverty has different name
  //   xVar = 'np_seg'
  // } else {
  //   xVar = xVar.split('_')[0] + '_' + secondary
  // }
  return (locations && locations.length > 0)
    ? `${BASE_URL}#/embed/chart/${filterArrayToString(filters)}/${region}/${metric}/${secondary}+secondary/${demographic}/${zoom}/${latitude}/${longitude}/${locations}`
    : `${BASE_URL}#/embed/chart/${filterArrayToString(filters)}/${region}/${metric}/${secondary}+secondary/${demographic}/${zoom}/${latitude}/${longitude}`
}

const getEmbedCode = link => {
  return `<iframe src="${link}" style="width:720px;height:405px;max-width:100%;" frameborder="0"></iframe>`
}

export const EmbedDialog = () => {
  const [copied, setCopied] = React.useState('')
  const [open, toggleEmbedDialog] = useEmbedDialogVisibility()
  
  const {
    hasGapChart: secondaryChart,
  } = useAppContext()
  const [viewport] = useMapViewport()
  const filters = useFilters()
  const rest = useDataOptions(({ region, metric, secondary, demographic, locations }) => ({
    region,
    metric,
    secondary,
    demographic,
    locations,
    ...viewport,
    filters: filters,
  }), shallow)
  
  const mapLink = getMapEmbedLink(rest)
  const chartLink = getChartEmbedLink(rest)
  const mapEmbedCode = getEmbedCode(mapLink)
  const chartEmbedCode = getEmbedCode(chartLink)
  const secondaryMetrics = getSecondaryChartsForDemographic(
    rest.demographic
  )
  const secondaryChartLink = secondaryMetrics
    ? getSecondaryChartEmbedLink({ ...rest })
    : null
  const secondaryEmbedCode = secondaryMetrics
    ? getEmbedCode(secondaryChartLink)
    : null

  const handleFocus = event => event.target.select()

  return (
    <Dialog
      className="dialog dialog--embed"
      classes={{ paper: 'dialog__container' }}
      open={open}
      onClose={toggleEmbedDialog}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {getLang('EMBED_DIALOG_TITLE')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getLang('EMBED_MAP_INSTRUCTIONS')}{' '}
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer">
            {getLang('EMBED_MAP_PREVIEW')}
          </a>
        </DialogContentText>

        <TextField
          label={getLang('EMBED_MAP_INPUT_LABEL')}
          type="text"
          value={mapEmbedCode}
          fullWidth
          onFocus={handleFocus}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={getLang('EMBED_COPY_LABEL')}
                  onClick={() => {
                    copy(mapEmbedCode)
                    setCopied('map')
                    onShare(window.location.href, 'embed')
                  }}>
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {copied === 'map' && (
          <span className="embed-dialog__copied">Copied!</span>
        )}
        <DialogContentText>
          <br />
          {getLang('EMBED_CHART_INSTRUCTIONS')}{' '}
          <a
            href={chartLink}
            target="_blank"
            rel="noopener noreferrer">
            {getLang('EMBED_CHART_PREVIEW')}
          </a>
        </DialogContentText>
        <TextField
          label={getLang('EMBED_CHART_INPUT_LABEL')}
          type="text"
          value={chartEmbedCode}
          fullWidth
          onFocus={handleFocus}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={getLang('EMBED_COPY_LABEL')}
                  onClick={() => {
                    copy(chartEmbedCode)
                    setCopied('chart')
                    onShare(window.location.href, 'embed')
                  }}>
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {copied === 'chart' && (
          <span className="embed-dialog__copied">Copied!</span>
        )}
        {secondaryMetrics && secondaryChart && (
          <>
            <DialogContentText>
              <br />
              {getLang('EMBED_SECONDARY_INSTRUCTIONS')}{' '}
              <a
                href={secondaryChartLink}
                target="_blank"
                rel="noopener noreferrer">
                {getLang('EMBED_CHART_PREVIEW')}
              </a>
            </DialogContentText>

            <TextField
              label={getLang('EMBED_CHART_INPUT_LABEL')}
              type="text"
              value={secondaryEmbedCode}
              fullWidth
              onFocus={handleFocus}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={getLang('EMBED_COPY_LABEL')}
                      onClick={() => {
                        copy(secondaryEmbedCode)
                        setCopied('secondary')

                        // maybe
                        onShare(window.location.href, 'embed')
                      }}>
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {copied === 'secondary' && (
              <span className="embed-dialog__copied">
                Copied!
              </span>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleEmbedDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
