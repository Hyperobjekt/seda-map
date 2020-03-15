import React, {
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react'
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

import { genId } from '../../../../shared/utils'

const ScatterplotBase = ({
  theme,
  options,
  loading,
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
  const ref = useRef(null)

  const eventsDict = {
    click: onClick,
    mouseover: onHover,
    mouseout: onHover
  }

  /**
   * Bind events when the chart is ready
   */
  const handleChartReady = e => {
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
        ref={ref}
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
        onEvents={eventsDict}
        {...props}
      />
    )
  )
}

ScatterplotBase.propTypes = {
  options: PropTypes.object,
  style: PropTypes.object,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onReady: PropTypes.func,
  onMouseMove: PropTypes.func,
  notMerge: PropTypes.bool,
  theme: PropTypes.object
}

export default ScatterplotBase
