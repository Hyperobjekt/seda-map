import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { CheckboxGroup } from '../../../../shared/components/Inputs/Checkboxes'
import { useRegion } from '../../app/hooks'
import { FILTER_FLAGS } from '../../app/constants/flags'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { getPrefixLang } from '../../app/selectors/lang'
import useActiveFilters from '../hooks/useActiveFilters'
import useFilterStore from '../../../filters'

const makeCheckboxes = (flags, checked) => {
  return flags.map(flag => ({
    id: flag,
    label: getPrefixLang(flag, 'FLAG_LABEL'),
    checked: checked.indexOf(flag) > -1
  }))
}

const SedaFilterFlags = ({ ...props }) => {
  const [region] = useRegion()
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // pull active flag filters from the filters array
  const checked = filters
    .filter(f => f[0] === 'eq')
    .map(f => f[1])
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  // get checkbox group from flags and active filters
  const checkboxGroups = useMemo(() => {
    return FILTER_FLAGS[region].map(flagGroup =>
      makeCheckboxes(flagGroup, checked)
    )
  }, [region, checked])
  console.log(checked, filters, checkboxGroups)

  /**
   * Adds / removes items from the `checked` array on change
   * @param {*} event
   * @param {*} key
   */
  const handleCheckboxChange = (checkbox, event) => {
    const key = checkbox.id
    console.log('checked', event, key)
    const isOn = checked.indexOf(key) > -1
    isOn
      ? removeFilter(['eq', key, 1])
      : setFilter(['eq', key, 1])
  }

  return (
    <PanelListItem
      title={getPrefixLang(region + '_type', 'FILTER_LABEL')}
      {...props}>
      {checkboxGroups.map((group, i) => (
        <CheckboxGroup
          key={i}
          checkboxes={group}
          onChange={handleCheckboxChange}
        />
      ))}
    </PanelListItem>
  )
}

SedaFilterFlags.propTypes = {}

export default SedaFilterFlags
