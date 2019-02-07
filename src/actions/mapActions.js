export const onHoverFeature = (hoveredFeature) => ({
  type: 'SET_HOVERED_FEATURE',
  hoveredFeature
});

export const onViewportChange = (viewport) => ({
  type: 'SET_MAP_VIEWPORT',
  viewport
});

export const onDemographicChange = (demographic) => ({
  type: 'SET_MAP_DEMOGRAPHIC',
  demographic
});

export const onMetricChange = (metric) => ({
  type: 'SET_MAP_METRIC',
  metric
});

export const onRegionChange = (region) => ({
  type: 'SET_MAP_REGION',
  region
});