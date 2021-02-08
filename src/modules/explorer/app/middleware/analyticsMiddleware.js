//import useFilterLocationName from '../../filters/hooks/useFilterLocationName'

let lastUpdate = null

/**
 * Returns values in the `next` object that have changed from the `previous` object
 * @param {*} next
 * @param {*} previous
 */
const getPropertyChanges = (next, previous) => {
  return Object.keys(next).reduce((obj, current) => {
    if (
      !previous ||
      !previous.hasOwnProperty(current) ||
      (previous.hasOwnProperty(current) &&
        previous[current] !== next[current])
    ) {
      // if there was no last update, then all changes are new
      if (!obj) obj = {}
      obj[current] = next[current]
    }
    return obj
  }, false)
}

/**
 * Returns values in the `next` object that are the same as the `previous` object
 * @param {*} next
 * @param {*} previous
 */
const getSameProperties = (next, previous) => {
  return Object.keys(next).reduce((obj, current) => {
    if (
      previous &&
      previous.hasOwnProperty(current) &&
      previous[current] === next[current]
    ) {
      if (!obj) obj = {}
      obj[current] = next[current]
    }
    return obj
  }, false)
}

const filterAndLog = item => {
    if(item.metric) {
        window.dataLayer.push({event: 'metricSelected', metricSelection: item.metric })
    }
    if(item.region) {
        window.dataLayer.push({event: 'geoTypeSelected', geoTypeSelection: item.region })
    }
    if(item.demographic) {
        window.dataLayer.push({event: 'studentTypeSelected', studentTypeSelection: item.demographic })
    }
    if(item.showEmbedDialog) {
        window.dataLayer.push({event: 'shareType', shareType: 'embed' })
    };
    if(item.showLinkDialog) {
        window.dataLayer.push({event: 'shareType', shareType: 'link' })
    };
    if(item.showChart === true || item.showChart === false) {
        window.dataLayer.push({event: 'chartButtonSelected', chartButtonSelection: item.showChart })
    };
    if(item.view) {
        window.dataLayer.push({event: 'displayTypeSelected', displayTypeSelection: item.view })
    };
}

const analyticsMiddleware = config => (set, get, api) =>
  config(
    args => {
      const newValues =
        typeof args === 'function' ? args(get()) : args
      // gets the values that have changed since the last update
      const changes = getPropertyChanges(newValues, lastUpdate)
      // checks if any values are the same as the last update (indicating side-effect)
      const same = getSameProperties(newValues, lastUpdate)
      // if there are changes that are not a side effect of another action, track them
      if (changes && !same) {
        filterAndLog(changes)
        //console.log('track these changes:', changes)
      }
      if (changes) {
        //console.log('state change:', changes)
        set(args)
        lastUpdate = changes
      }
    },
    get,
    api
  )

  export default analyticsMiddleware
