import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'

// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core'

// manually import required echarts components
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/chart/custom'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markArea'

import { getScatterplotOptions, getDataForId } from './utils'
import { genId } from '../../../../shared/utils'

const ScatterplotBase = ({
  theme,
  options: optionOverrides,
  xVar,
  yVar,
  zVar,
  data,
  loading,
  scale,
  selected,
  highlighted,
  spinner = '#0078d4',
  style,
  onHover,
  onClick,
  onReady,
  onMouseMove,
  onMouseOver,
  onMouseOut,
  ...props
}) => {
  const [themeId, setThemeId] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const options = useMemo(
    () =>
      getScatterplotOptions({
        data,
        xVar,
        yVar,
        zVar,
        selected,
        highlighted,
        options: optionOverrides,
        scale
      }),
    [
      data,
      xVar,
      yVar,
      zVar,
      selected,
      highlighted,
      scale,
      optionOverrides
    ]
  )

  console.log(options)

  const handleClick = e => {
    if (!onClick) return
    const locationData = {
      id: e.data[3],
      ...getDataForId(e.data[3])
    }
    onClick(locationData, e)
  }

  const handleHover = e => {
    if (!onHover) return
    // index of the id property in the scatterplot data
    const idIndex = zVar ? 3 : 2
    // get the data array for the hovered location
    const hoverData =
      e && e.data && e.data.hasOwnProperty('value')
        ? e.data['value']
        : e.data
    // get the data from the state for the location
    const locationData =
      hoverData && e.type === 'mouseover'
        ? {
            id: hoverData[idIndex],
            ...getDataForId(hoverData[idIndex], data)
          }
        : null
    // if there is a location then call onHover immediately
    if (locationData) {
      onHover(locationData, e)
      // clear the timeout if it is waiting to clear the hovered feature
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        setHoverTimeout(null)
      }
    } else {
      // set a timeout to inform the callback no items are hovered
      setHoverTimeout(
        setTimeout(() => {
          onHover(null, e)
        }, 200)
      )
    }
  }

  /**
   * Bind events when the chart is ready
   */
  const handleChartReady = e => {
    onHover && e.on('mouseover', handleHover)
    onHover && e.on('mouseout', handleHover)
    onMouseMove && e.on('mousemove', onMouseMove)
    onClick && e.on('click', handleClick)
    onMouseOver &&
      e.getDom().addEventListener('mouseover', onMouseOver)
    onMouseOut &&
      e.getDom().addEventListener('mouseout', onMouseOut)
    onReady && onReady(e)
  }

  /** Setup theme */
  useEffect(() => {
    if (!theme) return
    if (typeof theme === 'string') {
      setThemeId(theme)
    }
    if (typeof theme === 'object') {
      const themeId = genId()
      setThemeId(themeId)
      echarts.registerTheme(themeId, theme)
    }
  }, [theme])

  return (
    options && (
      <ReactEchartsCore
        echarts={echarts}
        onChartReady={handleChartReady}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          ...style
        }}
        option={options}
        theme={themeId}
        showLoading={loading}
        loadingOption={{
          color: spinner
        }}
        {...props}
      />
    )
  )
}

ScatterplotBase.propTypes = {
  options: PropTypes.object,
  style: PropTypes.object,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  data: PropTypes.object,
  selected: PropTypes.array,
  highlighted: PropTypes.array,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onReady: PropTypes.func,
  onMouseMove: PropTypes.func,
  notMerge: PropTypes.bool,
  theme: PropTypes.object,
  freeze: PropTypes.bool
}

export default ScatterplotBase
