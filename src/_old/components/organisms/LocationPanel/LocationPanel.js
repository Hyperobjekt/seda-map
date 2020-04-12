import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Panel from '../../molecules/Panel'
import {
  getRegionFromLocationId,
  getSelectedColors,
  getSingularRegion,
  getRegionFromFeature,
  getFeatureProperty
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import AccordionItem from '../../molecules/AccordionItem'
import LocationComparison from './LocationComparison'
import { LocationStatDiverging } from './LocationStats'
import LocationMetricDetails from './LocationMetricSumary'
import {
  Button,
  ButtonBase,
  Typography
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import usePrevious from '../../../shared/hooks/usePrevious'
import { getStateName } from '../../../shared/selectors/states'
import BaseMarker from '../../atoms/BaseMarker'

const SELECTED = getSelectedColors()

const LocationMetric = ({
  metric,
  feature,
  toggleExpanded,
  onGapClick,
  onHelpClick,
  expanded
}) => {
  const val = getFeatureProperty(feature, 'all_' + metric)
  const region = getRegionFromFeature(feature)
  const hasVal = Boolean(val) || val === 0
  return (
    <div className="metric-summary">
      <Typography
        component="h5"
        className="panel-section__heading">
        {getLang('PANEL_HEADING', {
          region: getSingularRegion(region),
          metric: getLang('LABEL_' + metric)
        })}
      </Typography>
      <LocationStatDiverging
        feature={feature}
        varName={'all_' + metric}
        label={getLang('LABEL_SHORT_' + metric)}
        showDescription={true}
        showLabels={true}
      />
      {hasVal && (
        <ButtonBase
          className="button button--link button--collapse"
          disableRipple={true}
          onClick={() => toggleExpanded('metric_' + metric)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          {expanded
            ? getLang('LOCATION_HIDE_' + metric)
            : getLang('LOCATION_SHOW_' + metric)}
        </ButtonBase>
      )}
      {expanded && hasVal && (
        <LocationMetricDetails
          metric={metric}
          feature={feature}
          onGapClick={onGapClick}
          onHelpClick={onHelpClick}
        />
      )}
    </div>
  )
}
LocationMetric.propTypes = {
  metric: PropTypes.string,
  feature: PropTypes.object,
  toggleExpanded: PropTypes.func,
  onGapClick: PropTypes.func,
  onHelpClick: PropTypes.func,
  expanded: PropTypes.bool
}

const LocationHeading = ({ idx, feature }) => {
  const stateName = getStateName(
    feature.properties.id.substring(0, 2)
  )
  return (
    <div className="location-item">
      {(idx || idx === 0) && (
        <BaseMarker
          aria-label={'Location number ' + (parseInt(idx) + 1)}
          className="location-item__marker"
          color={SELECTED[idx]}
          type="circle">
          {idx + 1}
        </BaseMarker>
      )}
      <div className="location-item__content-wrapper">
        <h4 className="location-item__heading">
          <span className="location-item__name">
            {feature.properties.name}
          </span>
          <span className="location-item__state">
            {stateName}
          </span>
        </h4>
      </div>
    </div>
  )
}

const LocationPanel = ({
  feature,
  metric,
  flags = [],
  others = [],
  reportLoading,
  reportError,
  onClose,
  onGapClick,
  onHelpClick,
  onSelectFeature,
  onShowSimilar,
  onDownloadReport
}) => {
  // track state for expanded / collapsed items
  const [expanded, setExpanded] = useState([])
  // id of the location
  const id =
    feature && feature.properties ? feature.properties.id : null
  // name of the location
  const name =
    feature && feature.properties
      ? feature.properties.name
      : null
  const region = getRegionFromLocationId(id)
  // handler to toggle expand on / off
  const toggleExpanded = itemId =>
    setExpanded(
      expanded.indexOf(itemId) > -1
        ? expanded.filter(id => id !== itemId)
        : [...expanded, itemId]
    )
  const selectedIndex =
    feature &&
    others.findIndex(
      (f, i) => f.properties.id === feature.properties.id
    )
  const markerColor = SELECTED[selectedIndex]

  // track open state to give focus
  const prevOpen = usePrevious(Boolean(feature))

  // effect to give proper focus on open / close
  useEffect(() => {
    if (!prevOpen && feature) {
      setTimeout(() => {
        const el = document.getElementById('locationClose')
        if (el && el.focus) {
          el.focus()
        }
      }, 500) // give some time to open the panel
    }
    if (prevOpen && !feature) {
      // restore focus to active view toggle
      const el = document.querySelector(
        '.toggle-buttons__button--active'
      )
      if (el && el.focus) {
        el.focus()
      }
    }
  }, [feature, prevOpen])

  return feature && feature.properties ? (
    <Panel
      id="locationPanel"
      title={
        id && (
          <LocationHeading
            idx={selectedIndex}
            feature={feature}
          />
        )
      }
      classes={{ root: 'panel--location' }}
      onClose={onClose}
      open={Boolean(feature)}
      closeId="locationClose">
      <div className="panel-section panel-section--summary">
        <div className="panel-section__content">
          {flags && flags.length > 0 && (
            <div className="flags">
              {flags.map(f => (
                <Typography
                  className="flags__flag"
                  key={f}
                  dangerouslySetInnerHTML={{
                    __html: getLang('FLAG_' + f)
                  }}
                />
              ))}
            </div>
          )}

          <LocationMetric
            feature={feature}
            metric="avg"
            expanded={expanded.indexOf('metric_avg') > -1}
            onGapClick={onGapClick}
            onHelpClick={onHelpClick}
            toggleExpanded={toggleExpanded}
          />
          <hr />
          <LocationMetric
            feature={feature}
            metric="grd"
            expanded={expanded.indexOf('metric_grd') > -1}
            onGapClick={onGapClick}
            onHelpClick={onHelpClick}
            toggleExpanded={toggleExpanded}
          />
          <hr />
          <LocationMetric
            feature={feature}
            metric="coh"
            expanded={expanded.indexOf('metric_coh') > -1}
            onGapClick={onGapClick}
            onHelpClick={onHelpClick}
            toggleExpanded={toggleExpanded}
          />
          <hr />
          <Typography
            component="h5"
            className="panel-section__heading">
            {getLang('PANEL_HEADING', {
              region: getSingularRegion(region),
              metric: getLang(
                region === 'schools'
                  ? 'LABEL_FRL'
                  : 'LABEL_SES_NO_REGION'
              )
            })}
          </Typography>
          <LocationStatDiverging
            feature={feature}
            varName={
              region === 'schools' ? 'all_frl' : 'all_ses'
            }
            label={getLang(
              'LABEL_SHORT_' +
                (region === 'schools' ? 'FRL' : 'SES')
            )}
            showDescription={true}
            showLabels={true}
          />
        </div>
      </div>
      <LocationComparison
        id="compare"
        feature={feature}
        markerColor={markerColor}
        name={name}
        region={region}
        others={others}
        expanded={expanded.indexOf('compare') > -1}
        onChange={toggleExpanded}
        onSelectFeature={onSelectFeature}
        onShowSimilar={onShowSimilar}
      />
      <AccordionItem
        id="export"
        expanded={expanded.indexOf('export') > -1}
        heading={getLang('LOCATION_EXPORT_REPORT_TITLE')}
        onChange={toggleExpanded}>
        <Typography paragraph={true}>
          {getLang('LOCATION_EXPORT_REPORT', { name })}
        </Typography>
        {reportError && (
          <p className="error">Error generating report.</p>
        )}
        {reportLoading ? (
          <p>{getLang('UI_REPORT_LOADING')}</p>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onDownloadReport(feature)
            }}>
            {getLang('BUTTON_DOWNLOAD_REPORT')}
          </Button>
        )}
      </AccordionItem>
    </Panel>
  ) : null
}

LocationPanel.propTypes = {
  feature: PropTypes.object,
  others: PropTypes.array,
  metric: PropTypes.string,
  icon: PropTypes.any,
  onClose: PropTypes.func,
  onGapClick: PropTypes.func,
  onHelpClick: PropTypes.func,
  onSelectFeature: PropTypes.func,
  onShowSimilar: PropTypes.func,
  onDownloadReport: PropTypes.func
}

export default LocationPanel
