import { fromJS } from 'immutable'

/**
 * Sources used in the map style. These are custom tilesets generated in the SEDA ETL pipeline (https://github.com/Hyperobjekt/seda-etl/)
 */
export const SEDA_SOURCES = fromJS({
  seda: {
    url:
      'mapbox://hyperobjekt.states-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.counties-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.districts-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.schools-v4-' +
      process.env.REACT_APP_BUILD_ID,
    type: 'vector'
  }
})

export const US_VIEWPORT = {
  latitude: 37.39,
  longitude: -96.78,
  zoom: 3.15
}

export const ALASKA_VIEWPORT = {
  latitude: 63,
  longitude: -151.7,
  zoom: 3.15
}

export const HAWAII_VIEWPORT = {
  latitude: 20.39,
  longitude: -157.39,
  zoom: 5.8
}

export const PUERTO_RICO_VIEWPORT = {
  latitude: 18.18,
  longitude: -66.27,
  zoom: 7.5
}
