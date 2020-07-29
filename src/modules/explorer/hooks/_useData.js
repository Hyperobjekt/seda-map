import create from 'zustand'
import {
  loadFeatureFromCoords, loadFeaturesFromRoute,
} from '../utils'

/**
 * Gets an object with all of the provided features' data
 * with the ID as the key
 * @param {Array<GeoJsonFeature} an array of features
 */
const getFeatureData = features => {
  return features.reduce((obj, feature) => {
    obj[feature.properties.id] = feature.properties
    return obj
  }, {})
}

const [useData] = create((set, get) => ({
  data: {},
  loading: true,
  setLoading: loading => set({ loading }),
  // adds a feature to the object containing data for hovered / selected features
  addData: featureData => {
    if (get().data.hasOwnProperty(featureData.id)) return
    set(state => {
      const newState = {
        data: {
          ...state.data,
          [featureData.id]: featureData
        }
      }
      return newState
    })
  },
  loadData: async ({ id, lat, lon }) => {
    // check if feature is already in the store
    if (get().data[id]) return get().data[id]
    // load the feature
    set({ loading: true })
    const feature = await loadFeatureFromCoords({ id, lat, lon })
    set(state => {
      return {
        data: {
          ...state.data,
          ...getFeatureData([feature])
        },
        loading: false
      }
    })
    return feature
  },
  loadDataFromRoute: async (route) => {
    // load the features
    set({ loading: true })
    const features = await loadFeaturesFromRoute(route)
    if (!features || features.length === 0) return []
    // set the loaded features in locations
    set(state => ({
      data: {
        ...state.data,
        ...getFeatureData(features)
      },
      loading: false
    }))
    return features;
  },
}))

export default useData
