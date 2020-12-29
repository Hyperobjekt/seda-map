import React from 'react'
import { getLang } from '../../app/selectors/lang'
import { Button } from '@material-ui/core'
import useFilterStore from '../../../filters'

const SedaClearFilterButton = props => {
  // function to clear filters
  const clearFilters = useFilterStore(
    state => state.clearFilters
  )

  /**
   * Sets filters to default values and clears selected location
   */
  const handleResetFilters = () => {
    clearFilters()
  }

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleResetFilters}
      {...props}>
      {getLang('FILTER_RESET')}
    </Button>
  )
}

export default SedaClearFilterButton
