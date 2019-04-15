import React, { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SedaScatterplot from 'react-seda-scatterplot'
import { theme } from '../../style/echartTheme';
import { getBaseVars, getRangeFromVarName } from '../../modules/config'
import { getScatterplotOptions } from '../../style/scatterplot-style';
import CircleOverlay from './CircleOverlay';
import { getSizerFunction } from '../../utils';
import { getDataForId } from '../../modules/scatterplot';

/**
 * Gets the state IDs that belong to a certain state
 * @param {array} ids 
 * @param {string} fips 
 */
const getStateIds = (ids, fips) => {
  if (ids && fips) {
    return ids
      .filter(d => d.substring(0,2) === fips)
  }
  return [];
}

/**
 * Gets the IDs for a provided state from the data
 * @param {string} stateId 
 * @param {object} data 
 */
const getStateHighlights = (stateId, data) => {
  return data && data['name'] && stateId ? 
    getStateIds(Object.keys(data['name']), stateId) : []
}

function DynamicScatterplot({
  data,
  xVar,
  yVar,
  zVar,
  region,
  hovered,
  highlightedState,
  variant,
  selected,
  onHover,
  onClick,
  onData,
  onReady
}) {
  const scatterplotOptions = useMemo(
    () => getScatterplotOptions(
      variant, 
      data[region], 
      { xVar, yVar, zVar }, 
      highlightedState
    ),
    [xVar, yVar, zVar, highlightedState, data[region]]
  );
  const highlighted = useMemo(
    () => getStateHighlights(highlightedState, data && data[region]),
    [highlightedState, region]
  );
  const [circleOverlay, setCircleOverlay] = useState({});
  useEffect(() => {
      data[region][xVar] && data[region][yVar] && data[region][zVar] &&
      setCircleOverlay({
        xRange: getRangeFromVarName(xVar),
        yRange: getRangeFromVarName(yVar),
        sizer: getSizerFunction(data[region][zVar], { range: [ 12, 52 ]}),
        circles: selected.map(s => ({
          x: data[region][xVar][s],
          y: data[region][yVar][s],
          z: data[region][zVar][s],
          active: hovered === s,
          id: s
        }))
      })
    },
    [xVar, yVar, data[region], selected, hovered]
  )
  return (
    <div className='dynamic-scatterplot'>
      <div className='dynamic-scatterplot__graph'>
        <SedaScatterplot
          endpoint={process.env.REACT_APP_VARS_ENDPOINT}
          xVar={xVar}
          yVar={yVar}
          zVar={zVar}
          hovered={hovered}
          onReady={onReady}
          onHover={(loc) => loc && loc.id ?
              onHover({ id: loc.id, properties: loc }) :
              null
          }
          onClick={onClick}
          onData={onData}
          data={data}
          prefix={region}
          options={scatterplotOptions}
          highlighted={highlighted}
          theme={theme}
          baseVars={getBaseVars()}
        />
        <CircleOverlay
          {...circleOverlay}
          variant={variant}
          style={{
            ...scatterplotOptions.grid
          }}
          onHover={(circle) => {
            onHover({
              id: circle.id, 
              properties: { 
                id: circle.id,
                ...getDataForId(circle.id, data[region])
              }
            })
          }}
          onClick={(circle) => { 
            onClick({
              id: circle.id,
              ...getDataForId(circle.id, data[region])
            })
          }}
        />
      </div>
    </div>
  )
}

DynamicScatterplot.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  region: PropTypes.string,
  data: PropTypes.object,
  highlightedState: PropTypes.string,
  selected: PropTypes.array,
  hovered: PropTypes.string,
  variant: PropTypes.string,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onData: PropTypes.func,
  onReady: PropTypes.func
}

export default DynamicScatterplot

