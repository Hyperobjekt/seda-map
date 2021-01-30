import React, { useCallback } from 'react'
import useFilterStore, {
  getFilterValue
} from '../../../filters/useFilterStore'
import { useActiveOptions } from '../../app/hooks'
import { DEFAULT_RANGES } from '../../app/constants/metrics'
import shallow from 'zustand/shallow'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { DebouncedSlider as Slider } from '../../../../shared'
import { getPrefixLang } from '../../app/selectors/lang'
import { getFormatterForVarName } from '../../app/selectors'
import useActiveFilters from '../hooks/useActiveFilters'
import { Tooltip, withStyles } from '@material-ui/core'

const ValueLabelComponent = (props) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" arrow title={value}>
      {children}
    </Tooltip>
  );
}

const getDefaultValue = (region, metric) => {
  const vals = DEFAULT_RANGES[region]
  if (!vals || !vals[metric]) return [-1, 1]
  return vals[metric]
}

const SedaMetricSlider = ({ metricId, classes, isActive, ...props }) => {
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  const [, demographic, region] = useActiveOptions()
  const varName = [demographic, metricId].join('_')
  const value = getFilterValue(filters, ['range', metricId])
  const defaultValue = getDefaultValue(region, metricId)
  const min = defaultValue[0]
  const max = defaultValue[1]
  const step = (max - min) / 20
  const average = min + (max - min) / 2
  const formatter = getFormatterForVarName(varName)
  const marks = [
    {
      value: min,
      label: formatter(min)
    },
    {
      value: average,
      label: "average"
    },
    {
      value: max,
      label: formatter(max)
    }
  ]
  const handleSliderChange = useCallback(
    (event, value) => {
      value = value.map(v => parseFloat(v))
      // if set to a default value then clear the filter
      shallow(defaultValue, value)
        ? removeFilter(['range', metricId], true)
        : setFilter(['range', metricId, value])
    },
    [setFilter, removeFilter, defaultValue, metricId]
  )
  return (
    <PanelListItem
      title={getPrefixLang(metricId, 'FILTER_LABEL')}
      desc={getPrefixLang(`${metricId}_desc`, 'FILTER_LABEL')}
      titleProps={{ id: metricId + '-slider' }}
      {...props}>
      <Slider
        ValueLabelComponent={ValueLabelComponent}
        marks={marks}
        valueLabelDisplay="auto"
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        aria-labelledby={metricId + '-slider'}
        getAriaValueText={formatter}
        valueLabelFormat={formatter}
        classes={classes}
      />
    </PanelListItem>
  )
}

SedaMetricSlider.propTypes = {}

export default withStyles(theme => ({
  root: {
    padding: '10px 0',
    position: 'relative'
  },
  thumb: {
    height: 12,
    width: 6,
    marginTop: -2,
    marginLeft: -3,
    border: '0.5px solid #757575',
    background: 'white',
    borderRadius: 2,
    '&:focus, &:hover, &$active': {
      height: 14,
      marginTop: -3,
      borderColor: 'currentColor',
      boxShadow: 'inherit'
    },
  },
  track: {
    height: 8,
    background: props => !props.isActive ? 'currentColor' : 'fixed linear-gradient(90deg, #1C4E81 100px, #3A7BBB 139px, #7CB4DC 178px, #C0E1EC 217px, #F5F6F7 256px, #D6EECA 295px, #9FDCA3 334px, #32A877 373px, #1B704D 412px)',
    [theme.breakpoints.down('sm')]: {
      background: props => !props.isActive ? 'currentColor' : 'fixed linear-gradient(90deg, #1C4E81 20px, #3A7BBB 59px, #7CB4DC 98px, #C0E1EC 137px, #F5F6F7 176px, #D6EECA 215px, #9FDCA3 254px, #32A877 293px, #1B704D 332px)',
    }
  },
  rail: {
    height: 8,
    background: '#E0E0E0',
    opacity: 1
  },
  mark: {
    height: 5,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 13
  },
  markLabel: {
    color: '#5D5D5D',
    marginTop: 2,
    [theme.breakpoints.down('sm')]: {
      top: 26
    }
  },
}))(SedaMetricSlider)
