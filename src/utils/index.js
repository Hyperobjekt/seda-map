/**
 * Checks if a property of two objects are equal
 */
export const isPropEqual = (obj1, obj2, propName) => {
  if (!obj1 && !obj2) { return true; }
  if (obj1 && !obj2) { return false; }
  if (!obj1 && obj2) { return false; }
  return (obj1.hasOwnProperty(propName) && 
          obj2.hasOwnProperty(propName) &&
          obj1[propName] === obj2[propName])
}


/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id 
 */
export const getRegionFromId = (id) => {
  const idLengths = {
    5: 'counties',
    7: 'districts',
    12: 'schools'
  }
  if (!idLengths[id.length]) {
    throw new Error('No region corresponding to provided ID');
  }
  return idLengths[id.length]
}

