import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
// import {
//   getScatterplotVars,
//   getMapVars,
//   isVersusFromVarNames,
//   isGapDemographic
// } from '../shared/selectors'
// import SedaScatterplotPreview from '../scatterplot/components/SedaScatterplotPreview'
// import SedaLocationMarkers from '../scatterplot/components/SedaLocationMarkers'
// import { Button, Typography, ButtonBase } from '@material-ui/core'
// import ScatterplotAxis from '../scatterplot/components/ScatterplotAxis'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
// import { getLang } from '../lang'
// import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
// import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

const LegendPanel = ({ title, expanded, children, className, ...rest }) => {
  return (
    <div className={classNames('legend-panel', className)} {...rest}>
      {title && <div className="legend-panel__title">{title}</div>}
      {expanded && <div className="legend-panel__content">{children}</div>}
    </div>
  )
}

LegendPanel.propTypes = {
  title: PropTypes.string,
  expanded: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  className: PropTypes.string
}

const MapLegend = ({
  metric,
  demographic,
  region,
  helpOpen = false,
  secondary,
  view = 'map',
  hovered,
  variant,
  onFullClick,
  onToggleClick,
  onHelpClick,
  classes = {}
}) => {
  // const vars = getScatterplotVars(region, metric, demographic)
  // const isVersus = isVersusFromVarNames(vars.xVar, vars.yVar)

  // const mapVars = getMapVars(region, metric, demographic)
  // const theme = useTheme()
  // const isAboveMedium = useMediaQuery(theme.breakpoints.up('md'))
  // // force condensed for split view and small viewports
  // variant = view === 'split' || !isAboveMedium ? 'condensed' : variant
  // const legendDescKey =
  //   'LEGEND_DESC_' + metric + (isGapDemographic(demographic) ? '_GAP' : '')
  // const legendMapKey =
  //   'LEGEND_MAP_' + metric + (isGapDemographic(demographic) ? '_GAP_' : '_')

  return null
  // <div
  //   className={classNames('map-legend', classes.root, {
  //     'map-legend--split-view': view === 'split'
  //   })}>
  //   <LegendPanel
  //     title="Map Legend"
  //     expanded={true}
  //     className={classNames({
  //       'legend-panel--versus': isVersus,
  //       'legend-panel--chart': variant === 'chart',
  //       'legend-panel--no-chart': variant !== 'chart'
  //     })}>
  //     <ScatterplotAxis
  //       axis="x"
  //       className="map-legend__legend-bar"
  //       varName={mapVars.yVar}
  //       hovered={hovered}
  //       region={region}
  //       valueLangPrefix={legendMapKey}
  //     />
  //     <Typography variant="caption" className="legend-panel__description">
  //       {getLang(legendDescKey, {
  //         gap: getLang('LABEL_SHORT_' + demographic),
  //         demographic:
  //           demographic === 'all' ? ' ' : getLang('LABEL_' + demographic)
  //       })}{' '}
  //       <ButtonBase
  //         aria-label="more info about what the map shows"
  //         onClick={() => onHelpClick(helpOpen)}
  //         className="button button--link">
  //         more info
  //       </ButtonBase>
  //     </Typography>

  //     {variant === 'chart' && (
  //       <div className="map-legend__preview">
  //         <SedaScatterplotPreview>
  //           <SedaLocationMarkers {...{ ...vars }} />
  //           <ScatterplotAxis
  //             axis="y"
  //             varName={vars.yVar}
  //             hovered={hovered}
  //             region={region}
  //             className="legend-bar--y-preview"
  //             labelPrefix="LEGEND_SHORT_"
  //           />
  //           <ScatterplotAxis
  //             axis="x"
  //             varName={vars.xVar}
  //             hovered={hovered}
  //             region={region}
  //             labelPrefix="LEGEND_SHORT_"
  //             className="legend-bar--x-preview"
  //           />
  //         </SedaScatterplotPreview>
  //         <div className="map-legend__chart-callout">
  //           {/* <Typography component="p">
  //               {
  //                 getLang(
  //                   legendChartKey, {
  //                     gap: getLang('LABEL_SHORT_' + demographic),
  //                     demographic: demographic === 'all' ? ' ' : getLang('LABEL_' + demographic)
  //                   }
  //                 )
  //               }
  //             </Typography> */}
  //           <Typography component="p">
  //             {getLang('LEGEND_CHART_INTERACTIVE')}
  //           </Typography>
  //           <Button variant="contained" color="primary" onClick={onFullClick}>
  //             {getLang('LEGEND_CHART_BUTTON')}
  //           </Button>
  //         </div>
  //       </div>
  //     )}
  //     {view === 'map' && isAboveMedium && (
  //       <div className="legend-actions">
  //         <Button onClick={onToggleClick}>
  //           {variant === 'chart' ? 'Hide Chart' : 'Show Chart'}
  //           {variant === 'chart' ? (
  //             <KeyboardArrowDown fontSize="small" />
  //           ) : (
  //             <KeyboardArrowUp fontSize="small" />
  //           )}
  //         </Button>
  //       </div>
  //     )}
  //   </LegendPanel>
  // </div>
}

MapLegend.propTypes = {
  variant: PropTypes.string,
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  secondary: PropTypes.string,
  hovered: PropTypes.object,
  classes: PropTypes.object,
  onFullClick: PropTypes.func,
  onToggleClick: PropTypes.func,
  onHelpClick: PropTypes.func
}

export default MapLegend
