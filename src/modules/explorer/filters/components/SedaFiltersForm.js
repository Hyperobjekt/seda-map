import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFilterStore } from '../../../filters'
import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button
} from '@material-ui/core'
import { getFormatterForVarName } from '../../app/selectors'
import shallow from 'zustand/shallow'
import { getPrefixLang, getLang } from '../../app/selectors/lang'
import { DEFAULT_RANGES } from '../../app/constants/metrics'
import {
  getFilterIndex,
  getFilterValue
} from '../../../filters/useFilterStore'
import {
  NumberSlider,
  DebouncedSlider as Slider
} from '../../../../shared'
import { hasFilterRule } from '../../../filters/utils'
import useFilters from '../hooks/useFilters'
import { useDemographic, useRegion } from '../../app/hooks'
import { SedaSearch } from '../../search'
import { getPropFromHit } from '../../search/selectors'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: theme.typography.pxToRem(16)
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: theme.spacing(2)
  },
  numberInput: {
    width: 64
  },
  primaryText: {
    textTransform: 'capitalize'
  },
  limitWrapper: {
    height: theme.spacing(6)
  }
}))

/**
 * Returns the search indicies for the current region
 * @param {*} region
 */
const getIndiciesForSearch = region => {
  switch (region) {
    case 'states':
      return []
    case 'counties':
      return ['states']
    case 'districts':
      return ['states']
    default:
      return ['states', 'districts']
  }
}

/**
 * Contains all inputs for modifying filters
 */
const SedaFiltersForm = props => {
  // track state for location selection
  const [selectedLocation, setSelectedLocation] = useState(null)
  // grab filters array
  const filters = useFilters()
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  const setFilter = useFilterStore(state => state.setFilter)
  const setFilters = useFilterStore(state => state.setFilters)

  // function to clear filters
  const clearFilters = useFilterStore(
    state => state.clearFilters
  )
  // get active demographic
  const [demographic] = useDemographic()
  // get active demographic
  const [region] = useRegion()
  // indices for search
  const indicies = getIndiciesForSearch(region)
  // school type checkboxes
  const checkboxes = [
    'middle',
    'elementary',
    'combined',
    'charter',
    'public',
    'magnet',
    'rural',
    'suburban',
    'urban'
  ]
  // checked school types
  const [checked, setChecked] = useState([...checkboxes])

  // get ranges from filter array
  const ranges = [
    'avg',
    'grd',
    'coh',
    region === 'schools' ? 'frl' : 'ses'
  ].reduce((obj, key) => {
    obj[key] = getFilterValue(filters, ['range', key])
    return obj
  }, {})

  // get limit filter from filters array, or set to default for region
  const limitValue =
    filters.reduce(
      (val, f) => (f[0] === 'limit' ? f[1] : val),
      false
    ) || DEFAULT_RANGES[region]['limit']

  // handler for when one of the metric ranges changes
  // memoize handler to prevent constant re-renders of slider component
  const handleRangeChange = useCallback(
    (type, event, value) => {
      value = value.map(v => parseFloat(v))
      // if set to a default value then clear the filter
      shallow(DEFAULT_RANGES[region][type], value)
        ? removeFilter(['range', type], true)
        : setFilter(['range', type, value])
    },
    [region, setFilter, removeFilter]
  )

  // handler for when the limit filter changes
  // memoize handler to prevent constant re-renders of slider component
  const handleLimitChange = useCallback(
    (event, value) => {
      value = parseInt(value)
      // if set to a default value then clear the filter
      if (value === DEFAULT_RANGES[region]['limit']) {
        removeFilter(['limit'], true)
      } else {
        const hasLimit = hasFilterRule(filters, ['limit'])
        // if limit rule doesn't already exist, add the sorting rule so it limts by size
        hasLimit
          ? setFilter(['limit', value])
          : setFilters(
              [['sort', 'sz', 'asc'], ['limit', value]],
              true
            )
      }
    },
    [region, setFilter, setFilters, removeFilter]
  )

  /**
   * Update the "startsWith" filter for places that start with
   * the given ID.
   * @param {*} id identifier for location
   * @param {*} hit selection from AlgoliaSearch component
   */
  const handleLocationSelect = (e, hit) => {
    const id = getPropFromHit(hit, 'id')
    setFilter(['startsWith', 'id', id])
    setSelectedLocation(hit.suggestionValue)
  }

  /**
   * Clear the current filter and remove the selected location
   */
  const handleLocationClear = () => {
    const index = getFilterIndex(filters, ['startsWith', 'id'])
    index > -1 && removeFilter(filters[index])
    setSelectedLocation('')
  }

  /**
   * Adds / removes items from the `checked` array on change
   * @param {*} event
   * @param {*} key
   */
  const handleSchoolTypeChange = (event, key) => {
    const newChecked =
      checked.indexOf(key) > -1
        ? checked.filter(c => c !== key)
        : [...checked, key]
    setChecked(newChecked)
  }

  /**
   * Sets filters to default values and clears selected location
   */
  const handleResetFilters = () => {
    setSelectedLocation('')
    clearFilters()
  }

  // clear the selected location if region is changed
  useEffect(() => {
    // get the location filter
    const locationPrefix = getFilterValue(filters, [
      'startsWith',
      'id'
    ])
    // clear district filter if needed
    if (
      region !== 'schools' &&
      locationPrefix &&
      locationPrefix.length > 5
    )
      handleLocationClear()
    // clear states filter if needed
    if (
      region === 'states' &&
      locationPrefix &&
      locationPrefix.length > 0
    )
      handleLocationClear()
  }, [region, filters])

  const classes = useStyles()
  return (
    <List {...props}>
      <ListItem className={classes.listItem}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleResetFilters}>
          {getLang('FILTER_RESET')}
        </Button>
      </ListItem>
      {region !== 'states' && (
        <ListItem className={classes.listItem}>
          <ListItemText
            primary={getPrefixLang('location', 'FILTER_LABEL', {
              region
            })}
          />
          <SedaSearch
            inputProps={{
              disabled: Boolean(selectedLocation)
            }}
            value={selectedLocation}
            hideSuggestions={selectedLocation ? true : false}
            placeholder={getPrefixLang(
              region,
              'FILTER_PLACEHOLDER'
            )}
            indices={indicies}
            activateSelection={false}
            onSelect={handleLocationSelect}
            onClear={handleLocationClear}
          />
        </ListItem>
      )}
      <ListItem className={classes.listItem}>
        <ListItemText
          primaryTypographyProps={{ id: 'limit-slider' }}
          primary={getPrefixLang('size', 'FILTER_LABEL')}
          secondary=""
        />
        <NumberSlider
          value={limitValue}
          min={10}
          max={DEFAULT_RANGES[region]['limit']}
          step={10}
          aria-labelledby="limit-slider"
          SliderProps={{
            onChange: handleLimitChange
          }}
          inputProps={{
            onChange: e => handleLimitChange(e, e.target.value)
          }}
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
              primary={getPrefixLang(key, 'FILTER_LABEL')}
            />
            <Slider
              value={ranges[key]}
              defaultValue={DEFAULT_RANGES[region][key]}
              min={DEFAULT_RANGES[region][key][0]}
              max={DEFAULT_RANGES[region][key][1]}
              step={
                (DEFAULT_RANGES[region][key][1] -
                  DEFAULT_RANGES[region][key][0]) /
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
      {region === 'schools' && (
        <ListItem className={classes.listItem}>
          <ListItemText
            primaryTypographyProps={{
              className: classes.primaryText
            }}
            primary={getPrefixLang(
              'school_type',
              'FILTER_LABEL'
            )}
          />
          <FormGroup>
            {checkboxes.map(key => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={checked.indexOf(key) > -1}
                    onChange={e =>
                      handleSchoolTypeChange(e, key)
                    }
                    name={key}
                    color="primary"
                  />
                }
                label={getPrefixLang(key, 'SCHOOL_TYPE')}
              />
            ))}
          </FormGroup>
        </ListItem>
      )}
    </List>
  )
}

SedaFiltersForm.propTypes = {}

export default SedaFiltersForm
