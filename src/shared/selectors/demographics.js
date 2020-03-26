import { DEMOGRAPHICS, GAPS } from '../constants/demographics'

/**
 * Gets the configuration for demographics
 */
export const getDemographics = () => DEMOGRAPHICS

/**
 * Gets the demographic object corresponding to the provided ID
 * @param {*} id
 */
export const getDemographicById = id =>
  getDemographics().find(d => d.id === id)

/**
 * Gets the configuration for gaps
 */
export const getGaps = () => GAPS

/**
 * Gets the region object corresponding to the provided ID
 */
export const getGapById = id => getGaps().find(r => r.id === id)

/**
 * Returns true if the demographic id represents a gap
 */
export const isGapDemographic = id => {
  return Boolean(getGapById(id))
}

/**
 * Returns the demographic id portion of the variable name
 */
export const getDemographicIdFromVarName = varName =>
  varName.split('_')[0]

/**
 * Returns the demographic object that corresponds to the demographic
 * id in the variable name.
 * @param {string} varName
 */
export const getDemographicFromVarName = varName => {
  const id = getDemographicIdFromVarName(varName)
  const dem = getDemographicById(id)
  return dem ? dem : getGapById(id)
}

/** Extracts the demographics from a gap identifier */
export const getGapDemographics = demId => {
  if (demId === 'pn') {
    return ['np', 'p']
  }
  if (demId.length === 2) {
    return [demId[0], demId[1]]
  }
  return [demId]
}

/** Returns a single demographic for the provided varNames */
export const getDemographicForVarNames = (xVar, yVar) => {
  const dem1 = getDemographicIdFromVarName(xVar)
  const dem2 = getDemographicIdFromVarName(yVar)
  // same dem for x and y
  if (dem1 === dem2) {
    return dem1
  }
  // all on X, but different on Y
  if (dem1 === 'all') {
    return dem2
  }

  // two different dems on x and y, must be gap

  // special case for poor / non-poor gap
  if (
    (dem1 === 'p' && dem2 === 'np') ||
    (dem1 === 'np' && dem2 === 'p') ||
    (dem1 === 'np' && dem2 === 'pn')
  ) {
    return 'pn'
  }
  // return default gap
  return dem1 + dem2
}

/**
 * Returns true if the variable name (e.g. wb_avg) represents a gap
 * @param {*} varName
 */
export const isGapVarName = varName => {
  const id = getDemographicIdFromVarName(varName)
  return Boolean(getGapById(id))
}

/** Checks if the x and y variables have the same metric */
export const isVersusFromVarNames = (xVar, yVar) =>
  xVar.split('_')[1] === yVar.split('_')[1]
