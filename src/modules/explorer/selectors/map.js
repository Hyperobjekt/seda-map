/**
 * Gets the vars for the map section
 */
export const getMapVars = (region, metric, demographic) => {
  if (region === "schools") {
    return {
      yVar: "all_" + metric,
      xVar: "all_frl",
      zVar: "all_sz",
    }
  }
  const useAll = ["m", "f", "p", "np"].indexOf(demographic) > -1
  return {
    yVar: demographic + "_" + metric,
    xVar: useAll ? "all_ses" : demographic + "_ses",
    zVar: demographic + "_sz",
  }
}
