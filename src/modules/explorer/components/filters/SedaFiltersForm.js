import React from 'react'
import PropTypes from 'prop-types'
import {
  useFilterStore,
  FilterList,
  FilterAdd
} from '../../../filters'
import logger from '../../../logger'
import SedaFilterSearch from './SedaFilterSearch'
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  Grid,
  Input,
  withStyles
} from '@material-ui/core'
import { getFormatterForVarName } from '../../selectors'
import shallow from 'zustand/shallow'
import { useDemographic } from '../../hooks'
import { getPrefixLang } from '../../selectors/lang'
import { DEFAULT_RANGES } from '../../constants/metrics'
import Slider from '../../../../shared/components/Slider'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: theme.typography.pxToRem(16)
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  input: {
    width: 64
  },
  primaryText: {
    textTransform: 'capitalize'
  }
}))

const SedaFiltersForm = props => {
  // grab filters array
  const filters = useFilterStore(state => state.filters)
  logger.debug('active filters', filters)
  // grab filter modifier functions
  const updateFilter = useFilterStore(
    state => state.updateFilter
  )
  // get active demographic
  const [demographic] = useDemographic()

  // get ranges from filter array
  const ranges = ['avg', 'grd', 'coh', 'ses'].reduce(
    (obj, key, index) => {
      const filter = filters.find(
        f => f[0] === 'range' && f[1] === key
      )
      const value = filter ? filter[2] : DEFAULT_RANGES[key]
      obj[key] = { index, value }
      return obj
    },
    {}
  )

  // get limit filter from filters array
  const limitFilter = filters.reduce(
    (obj, f, i) =>
      f[0] === 'limit' ? { index: i, value: f[1] } : obj,
    {}
  )

  // handler for when one of the metric ranges changes
  const handleRangeChange = (type, event, value) => {
    const isSameValue = shallow(value, ranges[type].value)
    if (isSameValue) return
    updateFilter(ranges[type].index, 2, value)
  }

  // handler for when the limit filter changes
  const handleLimitChange = (event, value) => {
    if (value === limitFilter.value) return
    updateFilter(limitFilter.index, 1, value)
  }

  //
  const handleLocationSelect = id => {
    updateFilter(0, 2, id)
  }

  //
  const handleLocationClear = () => {
    updateFilter(0, 2, '')
  }
  const classes = useStyles()
  return (
    <div {...props}>
      <List>
        <ListItem className={classes.listItem}>
          <ListItemText
            primary="Location"
            secondary="Show districts or schools within a state or county"
          />
          <SedaFilterSearch
            onSelect={handleLocationSelect}
            onClear={handleLocationClear}
          />
        </ListItem>
        {Object.keys(ranges).map((key, i) => {
          const formatter = getFormatterForVarName(
            demographic + '_' + key
          )
          return (
            <ListItem key={key} className={classes.listItem}>
              <ListItemText
                primaryTypographyProps={{
                  id: key + '-slider',
                  className: classes.primaryText
                }}
                primary={getPrefixLang(key, 'LABEL')}
                secondary="Only show places with values in the range below"
              />
              <Slider
                value={ranges[key].value}
                min={DEFAULT_RANGES[key][0]}
                max={DEFAULT_RANGES[key][1]}
                step={
                  (DEFAULT_RANGES[key][1] -
                    DEFAULT_RANGES[key][0]) /
                  20
                }
                onChange={(event, value) =>
                  handleRangeChange(key, event, value)
                }
                valueLabelDisplay="on"
                aria-labelledby={key + '-slider'}
                getAriaValueText={formatter}
                valueLabelFormat={formatter}
              />
            </ListItem>
          )
        })}
        <ListItem className={classes.listItem}>
          <ListItemText
            primaryTypographyProps={{ id: 'limit-slider' }}
            primary={getPrefixLang('size', 'LABEL')}
            secondary=""
          />
          <Grid container spacing={2} justify="flex-start">
            <Grid item xs={9}>
              <Slider
                value={limitFilter.value}
                min={DEFAULT_RANGES['limit'][0]}
                max={DEFAULT_RANGES['limit'][1]}
                step={10}
                onChange={handleLimitChange}
                valueLabelDisplay="off"
                aria-labelledby={'limit-slider'}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                className={classes.input}
                value={limitFilter.value}
                margin="dense"
                onChange={e =>
                  handleLimitChange(e, e.target.value)
                }
                inputProps={{
                  step: 10,
                  min: DEFAULT_RANGES['limit'][0],
                  max: DEFAULT_RANGES['limit'][1],
                  type: 'number',
                  'aria-labelledby': 'limit-slider'
                }}
              />
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </div>
  )
}

SedaFiltersForm.propTypes = {}

export default SedaFiltersForm
