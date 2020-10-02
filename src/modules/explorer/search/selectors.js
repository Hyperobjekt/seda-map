/**
 * Returns a property from the search hit
 * @param {*} hit
 * @param {*} propName
 */
export const getPropFromHit = (hit = {}, propName) => {
  if (!hit.suggestion || !hit.suggestion[propName]) return null
  return hit.suggestion[propName]
}
