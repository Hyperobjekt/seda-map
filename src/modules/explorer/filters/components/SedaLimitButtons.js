import React from 'react'
import { useRegion } from '../../app/hooks'
import {
  Button,
  ButtonGroup,
  withStyles
} from '@material-ui/core'
import clsx from 'clsx'
import { REGION_SIZE_FILTERS } from '../../app/constants/regions'
import { useActiveFilters } from '..'
import useFilterStore from '../../../filters'
import shallow from 'zustand/shallow'
import { getPrefixLang } from '../../app/selectors/lang'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { getFilterValue } from '../../../filters/useFilterStore'
import { format } from 'd3-format'

const formatNumber = format(',d')

const styles = theme => ({
  root: {},
  button: {},
  active: {
    color: theme.palette.primary.main,
    background: theme.palette.primary.highlight,
    borderColor: theme.palette.primary.main,
    // need to force right border color
    borderRightColor: theme.palette.primary.main + '!important'
  }
})

const SedaLimitButtons = ({ classes, ...props }) => {
  // function to remove a single filter
  const [removeFilter, setFilter] = useFilterStore(
    state => [state.removeFilter, state.setFilter],
    shallow
  )
  const filters = useActiveFilters()
  const [region] = useRegion()

  // get limit filter from filters array, or set to default for region
  const limitValue = getFilterValue(filters, ['limit'])

  const sizes = [...REGION_SIZE_FILTERS[region], 'all']

  const handleSetLimitFilter = value => {
    // no limit filter applied
    if (!limitValue && value === 'all') return
    // remove filter value
    if (value === 'all') return removeFilter(['limit'], true)
    // set the limit filter
    setFilter(['limit', value])
  }

  return (
    <PanelListItem
      title={getPrefixLang('size', 'FILTER_LABEL')}
      titleProps={{ id: 'limit-slider' }}
      {...props}>
      <ButtonGroup
        variant="outlined"
        className={clsx(classes.root)}
        {...props}>
        {sizes.map(size => {
          return (
            <Button
              key={size}
              className={clsx(classes.button, {
                [classes.active]:
                  (!limitValue && size === 'all') ||
                  parseInt(limitValue) === size
              })}
              onClick={e => handleSetLimitFilter(size, e)}>
              {size === 'all' ? size : formatNumber(size)}
            </Button>
          )
        })}
      </ButtonGroup>
    </PanelListItem>
  )
}

SedaLimitButtons.propTypes = {}

export default withStyles(styles)(SedaLimitButtons)
