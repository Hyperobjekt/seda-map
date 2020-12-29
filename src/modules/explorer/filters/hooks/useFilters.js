import shallow from 'zustand/shallow'
import useFilterStore from '../../../filters'

/**
 * Returns all filters for the explorer
 */
export default () => {
  return useFilterStore(state => state.filters, shallow)
}
