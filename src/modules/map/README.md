# Components

## `<MapBase />`

### Props

- `defaultViewport`: object containing `zoom`, `latitude`, and `longitude` properties that define the default / reset viewport
- `style`: overrides the default map style JSON
- `sources`: any additional [mapboxgl sources](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) that should be added to the map
- `layers`: any additional [mapboxgl layers](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/) to render on the map
- `hoveredId`: id of the currently hovered feature
- `selectedIds`: ids of any selected features (these receive a "selected" state accessible in the mapboxgl layer style)
- `children`: any children (e.g. legend)
- `idMap`: a map of numeric feature ids to feature property ids (for assigning feature state)
- `selectedColors`: array of colors to assign to "selected" features
- `ariaLabel`: label for map that is read by screen readers
- `onHover`: handler function for hovering over a feature
- `onClick`: handler function for clicking on a feature
- `onLoad`: handler function for when the map has loaded

Any additional props are passed on to the [ReactMapGL Interactive Map](https://visgl.github.io/react-map-gl/docs/api-reference/interactive-map)

### Example

**A map centered on New York City**

```js
const CustomMap = props => (
  <MapBase
    defaultViewport={{
      zoom: 11,
      latitude: 40.74,
      longitude: -73.96
    }}
    {...props}
  />
)
```

# Hooks

A collection of hooks are provided to allow access to map viewport information and manipulation.

## useMapViewport()

Provides map viewport value and setter

```js
const [viewport, setViewport] = useMapViewport()
```

Viewport value looks like:

```js
{
  width: 400,
  height: 400,
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 8
}
```

## useMapSize()

Provides pixel dimensions of the map viewport

```js
const [width, height] = useMapSize()
```

## useIdMap()

Provides map of GeoJSON feature ID to feature property ID. This is only used when a feature property ID is a non-numeric value.

```js
const [idMap, addToIdMap] = useIdMap()
```

## useFlyToState()

Provides a function that will fly the map to a state when given a fips code.

```js
const flyToState = useFlyToState()
flyToState('06')
```

## useFlyToFeature()

Provides a function that will fly the map to a GeoJSON feature

```js
const flyToFeature = useFlyToFeature()
flyToFeature(feature)
```

## useFlyToLatLon()

Provides a function that will fly the map to a provided latitude, longitude, and zoom;

```js
const flyToLatLon = useFlyToLatLon()
flyToLatLon(37, -122, 8)
```

## useFlyToReset()

Provides a function that flies the viewport back to the default viewport (set on the `<MapBase />` component with `defaultViewport` prop).

```js
const flyToReset = useFlyToReset()
flyToReset()
```
