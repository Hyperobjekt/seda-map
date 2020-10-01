import useFilterStore from '../../../filters'
import shallow from 'zustand/shallow'

/**
 * Returns all filters for the explorer
 */
export default () => {
  return useFilterStore(state => state.filters, shallow)
}
