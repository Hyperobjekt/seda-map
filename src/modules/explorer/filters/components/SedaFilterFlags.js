import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { CheckboxGroup } from '../../../../shared/components/Inputs/Checkboxes'
import { useRegion } from '../../app/hooks'
import { FILTER_FLAGS } from '../../app/constants/flags'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import useActiveFilters from '../hooks/useActiveFilters'
import useFilterStore from '../../../filters'
import {
  FormControl,
  FormLabel,
  withStyles
} from '@material-ui/core'

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

const makeCheckboxes = (flags, checked) => {
  return flags.map(flag => ({
    id: flag,
    label: getPrefixLang(flag, 'FLAG_LABEL'),
    checked: checked.indexOf(flag) > -1
  }))
}

const GROUP_TITLES = [
  getLang('FLAG_LABEL_AREA'),
  getLang('FLAG_LABEL_SCHOOL'),
  getLang('FLAG_LABEL_AGE')
]

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
  const uncheckedFlags = filters
    .filter(f => f[0] === 'eq' && f[2] === 0)
    .map(f => f[1])
  // pull active flag filters from the filters array
  const checkedFlags = regionFlags
    .flat()
    .filter(f => uncheckedFlags.indexOf(f) === -1)
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  // get checkbox group from flags and active filters
  const checkboxGroups = useMemo(() => {
    return regionFlags.map(flagGroup =>
      makeCheckboxes(flagGroup, checkedFlags)
    )
  }, [region, checkedFlags])

  /**
   * Adds / removes items from the `checked` array on change
   * @param {*} event
   * @param {*} key
   */
  const handleCheckboxChange = (checkbox, event) => {
    const key = checkbox.id
    const isOn = checkedFlags.indexOf(key) > -1
    isOn ? setFilter(['eq', key, 0]) : removeFilter(['eq', key])
  }

  return (
    <PanelListItem
      className={clsx(classes.root, className)}
      {...props}>
      {checkboxGroups.map((group, i) => (
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
      ))}
    </PanelListItem>
  )
}

SedaFilterFlags.propTypes = {}

export default withStyles(styles)(SedaFilterFlags)