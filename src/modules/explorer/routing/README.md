# Routing

Routing is manages by the `useRouting` hook which listens for changes to the application state and pushes them to that route hash. This is debounced so that routes update a maximum of once per 500ms.

On initial load of the app, the `useRouting` hook checks if there is a route set, and if so it will parse it and set the corresponding pieces in the application state.

## Route format

The route is structured as follows:

.../#/{VIEW}/{FILTER}/{REGION}/{METRIC}/{SECONDARY}/{SUBGROUP}/{ZOOM}/{LAT}/{LON}/{LOCATIONS?}

(e.g. .../#/map/id,48+avg,-5;3+limit,2120/counties/avg/ses/all/4.89/31.32/-100.08/20145,38.175,-99.187)

- `{VIEW}`: represents the current data view (`map`, `chart`, or `split`)
- `{FILTER}`: represents the current filter params. Each active filter is separated by a '+' character. The following filters can be applied:
  - `id,{ID}`: where `{ID}` is a state or district identifier to limit results to a location
  - `{METRIC},{MIN};{MAX}`: to only show a specific range of values for a given metric
  - `limit,{COUNT}`: to limit the number of locations shown, based on # of students (e.g. top 100 school districts)
  - `{FLAG}`: to hide locations that match a specific flag (`r` for rural, `s` for suburban, etc.)
    /id,48+avg,-5;3+grd,0;1.4+limit,2120
- `{REGION}`: represents the current region (`states`, `counties`, etc.)
- `{METRIC}`: represents the currently selected primary metric (`avg`, `grd`, or `coh`)
- `{SECONDARY}`: represents the currently selected secondary metric (`ses`, `seg`, `min`, or `frl`)
- `{SUBGROUP}`: represents the current subgroup or gap (`all`, `w`, `b`, etc.)
- `{ZOOM}`: zoom level of the map view
- `{LAT}`: latitude of the map view
- `{LON}`: longitude of the map view
- `{LOCATIONS}`: optional param that is populated as locations are selected. locations are formatted as "{ID},{LAT},{LON}", where the ID is the location ID and the LAT / LON are the latitude and longitude of the location on the map.

## Old Route Format

Prior to the new filtering and UI updates, routes were formatted the same, with the exception of the `{FILTER}` param.

Previously `{FILTER}` was a 2 letter state abbreviation (e.g. `tx`) to show places within a state, or `us` to show national.

On application load, any routes matching the old format should be updated to the new format outlined above.

**Example 1: National dataset**

Old route:

```
.../#/map/us/districts/coh/ses/all/3.42/38.3/-95.97
```

Updated route:

```
.../#/map/none/districts/coh/ses/all/3.42/38.3/-95.97
```

**Example 2: Texas dataset**

Old route:

```
.../#/map/tx/districts/coh/ses/all/3.42/38.3/-95.97
```

Updated route:

```
.../#/map/id,48/districts/coh/ses/all/3.42/38.3/-95.97
```

## Embed Routes

### Maps

Map embded routes follow the same formats outlined above with the following exceptions:

- they are prefixed with `/embed/`
- in the first release they do not have the `{FILTER}` param (needs to be updated)

In version 1, map embed routes did not include the `{FILTER}` param. This should be updated in v1.1 so the `{FILTER}` params are included. It is important that maps currently embedded do not break, so the embed view should check for old format routes and adjust accordingly

For example:

```
.../embed/map/districts/coh/all/3.42/38.3/-95.97
```

should become:

```
.../embed/map/none/districts/coh/all/3.42/38.3/-95.97
```

### Charts

Chart embeds are also prefixed with `/embed/`. In version 1, chart routes had the following format:

```
.../#/embed/chart/{FILTER}/{REGION}/{XVAR}/{YVAR}/{ZVAR}
.../#/embed/chart/ca/districts/all_ses/all_coh/all_sz
```

This should be updated to have similar routes as the explorer, just with `/embed/` prefixed:

```
.../#/embed/chart/{FILTER}/{REGION}/{METRIC}/{SECONDARY}/{SUBGROUP}/{LOCATIONS}
```

Any embedded charts using the old route should be redirected to the new version.
