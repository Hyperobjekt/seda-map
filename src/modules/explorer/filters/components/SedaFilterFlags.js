import React, { useMemo } from 'react'
import clsx from 'clsx'
import { CheckboxGroup } from '../../../../shared/components/Inputs/Checkboxes'
import { useRegion } from '../../app/hooks'
import {
  ALL_FILTER_FLAGS,
  EXCLUSIVE_FLAGS,
  FILTER_FLAGS
} from '../../app/constants/flags'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import useActiveFilters from '../hooks/useActiveFilters'
import useFilterStore from '../../../filters'
import {
  FormControl,
  FormLabel,
  Tooltip,
  withStyles
} from '@material-ui/core'
import { hasFilterRule } from '../../../filters/useFilterStore'

const styles = theme => ({
  root: {},
  group: {
    margin: theme.spacing(1, 0)
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1.5
  }
})

const makeCheckboxes = (flags, checked, regionFlags) => {
  return flags.map(flag => ({
    id: flag,
    label: getPrefixLang(flag, 'FLAG_LABEL'),
    checked: checked.indexOf(flag) > -1,
    disabled: regionFlags.indexOf(flag) < 0
  }))
}

const GROUP_TITLES = [
  getLang('FLAG_LABEL_AREA'),
  getLang('FLAG_LABEL_SCHOOL'),
  getLang('FLAG_LABEL_AGE')
]

/**
 * Returns true if the given flag is marked as exclusive
 * @param {*} flag
 */
const isExclusive = flag => {
  return EXCLUSIVE_FLAGS.indexOf(flag) > -1
}

/**
 * Gets all of the flag IDs that should be unchecked from
 * the provided filters.
 * @param {*} filters
 */
const getUncheckedFlags = filters => {
  const uncheckedExclusive = EXCLUSIVE_FLAGS.filter(
    flag => !hasFilterRule(filters, ['eq', flag, 1])
  )
  const uncheckedNonExclusive = filters
    .filter(
      f => f[0] === 'neq' && f[2] === 1 && !isExclusive(f[1])
    )
    .map(f => f[1])
  return [...uncheckedNonExclusive, ...uncheckedExclusive]
}

const getAvailableRegions = filters => {
  const availableRegions = Object.keys(FILTER_FLAGS)
    .filter(
      g =>
        FILTER_FLAGS[g].flat().length > 0 &&
        FILTER_FLAGS[g].flat().indexOf(filters[0].id) > -1
    )
    .join(' or ')

  return availableRegions
}

const SedaFilterFlags = ({ classes, className, ...props }) => {
  const [region] = useRegion()

  const regionFlags = FILTER_FLAGS[region]

  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // check filters for any flags that have been turned off
  const uncheckedFlags = getUncheckedFlags(filters)
  // pull active flag filters from the filters array
  const checkedFlags = regionFlags
    .flat()
    .filter(f => uncheckedFlags.indexOf(f) === -1)
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  // get checkbox group from flags and active filters
  const checkboxGroups = useMemo(() => {
    return ALL_FILTER_FLAGS.map((flagGroup, i) =>
      makeCheckboxes(
        flagGroup,
        checkedFlags,
        regionFlags.length > i ? regionFlags[i] : []
      )
    )
  }, [checkedFlags, regionFlags])

  /**
   * Adds / removes items from the `checked` array on change
   * @param {*} event
   * @param {*} key
   */
  const handleCheckboxChange = checkbox => {
    const key = checkbox.id
    const isOn = checkedFlags.indexOf(key) > -1
    // exclusive flag filters are set to 1 when checked
    if (isExclusive(key))
      return isOn
        ? removeFilter(['eq', key], true)
        : setFilter(['eq', key, 1])
    // non-excluse filters are removed when checked, or set to 0 when checked
    return isOn
      ? setFilter(['neq', key, 1])
      : removeFilter(['neq', key], true)
  }
  return (
    <PanelListItem
      className={clsx(classes.root, className)}
      {...props}>
      {checkboxGroups.map((group, i) =>
        i + 1 > regionFlags.length ? (
          <Tooltip
            arrow
            title={`These filters are only available in ${getAvailableRegions(
              group
            )} view`}
            placement="right">
            <FormControl
              className={classes.group}
              key={i}
              component="fieldset">
              <FormLabel
                className={classes.label}
                component="legend">
                {GROUP_TITLES[i]}
              </FormLabel>
              <CheckboxGroup
                checkboxes={group}
                onChange={handleCheckboxChange}
              />
            </FormControl>
          </Tooltip>
        ) : (
          <FormControl
            className={classes.group}
            key={i}
            component="fieldset">
            <FormLabel
              className={classes.label}
              component="legend">
              {GROUP_TITLES[i]}
            </FormLabel>
            <CheckboxGroup
              checkboxes={group}
              onChange={handleCheckboxChange}
            />
          </FormControl>
        )
      )}
    </PanelListItem>
  )
}

SedaFilterFlags.propTypes = {}

export default withStyles(styles)(SedaFilterFlags)
