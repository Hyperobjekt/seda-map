import create from 'zustand'
import * as _isEqual from 'lodash.isequal'

const [useFilterStore] = create((set, get) => ({
  filters: [
    ['startsWith', 'id', '06067'],
    ['sort', 'all_sz', 'asc'],
    ['limit', 100]
  ],
  addFilter: filter => {
    set(state => {
      const id = filter[0]

      // if sort rule, check if one exists
      const sortIndex = state.filters.findIndex(
        f => f[0] === 'sort'
      )
      if (id === 'sort' && sortIndex > -1)
        return {
          filters: state.filters.map(f =>
            f[0] === 'sort' ? filter : f
          )
        }

      // if limit rule, check if one exists
      const limitIndex = state.filters.findIndex(
        f => f[0] === 'limit'
      )
      if (id === 'limit' && limitIndex > -1)
        return {
          filters: state.filters.map(f =>
            f[0] === 'limit' ? filter : f
          )
        }

      // insert rule at appropriate spot
      const insertIndex =
        sortIndex > -1
          ? sortIndex
          : limitIndex > -1
          ? limitIndex
          : state.filters.length
      const startValues = state.filters.slice(0, insertIndex)
      const endValues = state.filters.slice(insertIndex)
      console.log('adding', [
        ...startValues,
        filter,
        ...endValues
      ])
      return { filters: [...startValues, filter, ...endValues] }
    })
  },
  setFilters: filters => set({ filters }),
  updateFilter: (ruleIndex, valueIndex, value) => {
    set(state => ({
      filters: state.filters.map((f, i) => {
        if (i !== ruleIndex) return f
        f[valueIndex + 1] = value
        return f
      })
    }))
  },
  removeFilter: filter => {
    set(state => ({
      filters: state.filters.filter(f => !_isEqual(f, filter))
    }))
  },
  clearFilters: () => set({ filters: [] })
}))

export default useFilterStore
