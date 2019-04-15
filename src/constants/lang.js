const LANG = {

  'NO_DATA': 'Unavailable',

  'LOGO_ALT_TEXT': 'Educational Opportunity Project',

  // Metric Labels
  'LABEL_AVG': 'Average Test Scores',
  'LABEL_GRD': 'Growth of test scores',
  'LABEL_COH': 'Trend of test scores',
  'LABEL_SEG': 'Segregation Measure',
  'LABEL_SES': 'Socioeconomic Status',

  // Demographic Labels
  'LABEL_ALL': 'All',
  'LABEL_B': 'Black',
  'LABEL_W': 'White',
  'LABEL_H': 'Hispanic',
  'LABEL_A': 'Asian',
  'LABEL_M': 'Male',
  'LABEL_F': 'Female',
  'LABEL_P': 'Poor',
  'LABEL_NP': 'Non-Poor',

  // Gap Labels
  'LABEL_WB': 'White / Black Gap',
  'LABEL_WH': 'White / Hispanic Gap',
  'LABEL_WA': 'White / Asian Gap',
  'LABEL_PN': 'Poor / Non-poor Gap',
  'LABEL_GAP': '$[demographic1] and $[demographic2]',

  // Region Labels
  'LABEL_COUNTIES': 'Counties',
  'LABEL_DISTRICTS': 'School Districts',
  'LABEL_SCHOOLS': 'Schools',

  // Explainers
  'EXPLAINER_AVG': 'Shows the set of educational opportunities children have had from birth to the time they take the tests',
  'EXPLAINER_GRD': 'Shows how much students learn on average while they are in school',
  'EXPLAINER_COH': 'Indicates the extent to which a community is getting better at providing educational opportunities over time',
  'EXPLAINER_SES': '',
  'EXPLAINER_SEG': '',

  // Description of metric value for location
  'VALUE_AVG': 'Students score $[amount] grade levels $[aboveBehind] average.',
  'VALUE_GRD': 'Students grow $[amount] grade levels each year.',
  'VALUE_COH': 'Test scores $[risingFalling] $[amount] grade levels over time.',
  'VALUE_SES': '',
  'VALUE_SEG': '',

  // Description of gap value for location
  'VALUE_AVG_GAP': 'Difference of $[amount] grade levels between $[gap] students.',
  'VALUE_GRD_GAP': 'Difference in growth $[increasedDecreased] $[amount] grade levels between $[gap] students.',
  'VALUE_COH_GAP': 'Difference in test scores $[increasedDecreased] $[amount] grade levels between $[gap] students.',
  'VALUE_SES_GAP': '',
  'VALUE_SEG_GAP': '',

  // Axis Labels
  'AXIS_AVG_ZERO': 'average\nperformance',
  'AXIS_AVG_LOW_SINGLE': '$[value] grade\nbehind',
  'AXIS_AVG_LOW': '$[value] grades\nbehind',
  'AXIS_AVG_HIGH_SINGLE': '$[value] grade\nahead',
  'AXIS_AVG_HIGH': '$[value] grades\nahead',

  'AXIS_GRD_ZERO': 'average\ngrowth',
  'AXIS_GRD_LOW_SINGLE': '$[value] grade level\nbehind',
  'AXIS_GRD_LOW': '$[value] grade levels\nbehind',
  'AXIS_GRD_HIGH_SINGLE': '$[value] grade level\nahead',
  'AXIS_GRD_HIGH': '$[value] grade levels\nahead',

  'AXIS_COH_ZERO': 'no change\nin test scores',
  'AXIS_COH_LOW_SINGLE': '$[value] grade level\nbehind',
  'AXIS_COH_LOW': '$[value] grade levels\nbehind',
  'AXIS_COH_HIGH_SINGLE': '$[value] grade level\nahead',
  'AXIS_COH_HIGH': '$[value] grade levels\nahead',

  'AXIS_AVG_GAP_ZERO': 'no gap\nin opportunity',
  'AXIS_AVG_GAP_LOW_SINGLE': '-$[value] grade level\ndifference',
  'AXIS_AVG_GAP_LOW': '-$[value] grade levels\ndifference',
  'AXIS_AVG_GAP_HIGH_SINGLE': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_HIGH': '$[value] grade levels\ndifference',

  'AXIS_GRD_GAP_ZERO': 'no change\nin growth gap',
  'AXIS_GRD_GAP_LOW': 'growth gap decreased\n$[value] grade levels',
  'AXIS_GRD_GAP_HIGH': 'growth gap increased\n$[value] grade levels',

  'AXIS_COH_GAP_ZERO': 'no change\nin trend',
  'AXIS_COH_GAP_LOW': '$[value] decrease\nin trend gap',
  'AXIS_COH_GAP_HIGH': '$[value] increase\nin trend gap',

  'AXIS_SES_ZERO': 'average\nsocioeconomic status',
  'AXIS_SES_LOW': 'poorer',
  'AXIS_SES_HIGH': 'richer',

  'AXIS_SES_ZERO_GAP': 'no gap in\nsocioeconomic status',
  'AXIS_SES_LOW_GAP': '$[demographic1] richer',
  'AXIS_SES_HIGH_GAP': '$[demographic2] richer',

  'AXIS_SEG_ZERO': 'no\nsegregation',
  'AXIS_SEG_LOW': 'less',
  'AXIS_SEG_HIGH': 'more',

  'AXIS_SEG_ZERO_GAP': 'no gap in\nsegregation',
  'AXIS_SEG_LOW_GAP': 'less',
  'AXIS_SEG_HIGH_GAP': 'more',

  // Location Cards
  'CARD_SEARCH_PLACEHOLDER': 'Add a county, district, or school',
  'CARD_SEARCH_HELPER': 'Use the search above to add and view data for a school, district, or county. You can select up to 7 locations.',

  // Intro Section
  'INTRO_TITLE': 'Explore educational opportunity in',
  'INTRO_DESCRIPTION': 'Using over 330 million test scores across the U.S., we have calculated $[avg], $[grd], and $[coh] to measure educational opportunity.',
  'SEARCH_PLACEHOLDER': 'Enter a city, county, district, or school',

  // Map Section
  'MAP_TITLE': 'Map of $[metric] for $[demographic] by $[region]',
  'MAP_DESCRIPTION': 'The map and scatterplot below shows how educational opportunity is correlated with socioeconomic status.  How does your area compare?',
  'MAP_DESCRIPTION_AVG': 'The average test scores of children in a community reveal the total set of educational opportunities they have had from birth to the time they take the tests.',
  'MAP_DESCRIPTION_GRD': 'Growth metric description.',
  'MAP_DESCRIPTION_COH': 'Trend metric description.',
  'MAP_DESCRIPTION_SES': 'Socioeconomic metric description.',
  'MAP_DESCRIPTION_SEG': 'Segregation metric description.',
  'MAP_DESCRIPTION_AVG_GAP': 'Average test score gap description.',
  'MAP_DESCRIPTION_GRD_GAP': 'Growth gap description.',
  'MAP_DESCRIPTION_COH_GAP': 'Trend gap description.',
  'MAP_DESCRIPTION_SES_GAP': 'SES gap description.',
  'MAP_CONTROL_TEXT': 'Showing $[metric] for $[demographic] by $[region] in $[state]',

  // Socioeconomic Section
  'SES_COND_TITLE': 'Socioeconomic Conditions',
  'SES_COND_DESCRIPTION': 'This section will show how the socioeconomic conditions compares to other areas. By default, it shows how average test scores correlate to socioeconomic status in the scatterplot. The scatterplot also allows the user to select any of the three key data metrics to see how they correlate to socioeconomic conditions.',
  'SES_CONTROL_TEXT': 'Showing $[metric] for $[demographic] by $[region] in $[state]',

  // Opportunity Differences Section
  'OPP_DIFF_TITLE': 'Opportunity Differences',
  'OPP_DIFF_DESCRIPTION': 'This section will show how opportunity differs among subgroups. By default, it will show achievement compared between poor and non-poor students. The scatterplot also allows the user to select any of the three key data metrics along with a list of subgroups to compare.',
  'OPP_DIFF_CONTROL_TEXT': 'Showing $[metric] for $[demographic1] vs. $[demographic2] by $[region] in $[state]',
  'OPP_DIFF_EQUAL_LINE': 'equal opportunity',

  // Achievement Gaps Section
  'ACH_GAPS_TITLE': 'Achievement Gaps',
  'ACH_GAPS_DESCRIPTION': 'This section will show how achievement gaps are associated with other variables like socioeconomic status or segregation. By default, it shows white / black achievement gap by white / black socioeconomic status gap. The scatterplot also allows the user to select the type of achievement gap and comparison variable.',
  'ACH_GAPS_CONTROL_TEXT': 'Showing the $[gap] of $[metric] vs. average test scores by $[region] in $[state]',

  // Map Legend (Mobile)
  'LEGEND_LOW_AVG': 'lower scores',
  'LEGEND_HIGH_AVG': 'higher scores',
  'LEGEND_LOW_GRD': 'less growth',
  'LEGEND_HIGH_GRD': 'more growth',
  'LEGEND_LOW_COH': 'scores dropping',
  'LEGEND_HIGH_COH': 'scores improving',

  'LEGEND_LOW_AVG_GAP': 'smaller gap',
  'LEGEND_HIGH_AVG_GAP': 'larger gap',
  'LEGEND_LOW_GRD_GAP': 'growth gap decreasing',
  'LEGEND_HIGH_GRD_GAP': 'growth gap increasing',
  'LEGEND_LOW_COH_GAP': 'trend gap decreasing',
  'LEGEND_HIGH_COH_GAP': 'trend gap increasing',

}

export default LANG

/**
 * Takes a text string and injects object keys that
 * match $[key]
 * @param {*} text 
 * @param {*} params 
 */
const interpolate = (text, params = {}) => {
  const arr = splitLang(text);
  return arr.map((a) => {
    if (a && a[0] !== '$') {
      return a
    } else {
      a = a.replace('$[', '')
      a = a.replace(']', '')
      if (params[a]) {
        return params[a]
      }
      return a
    }
  }).join('')
}

/**
 * Gets the language string for the given key and data
 * @param {string} key 
 * @param {object} props 
 */
export const getLang = (key = '', props = {}) => {
  key = key.toUpperCase();
  if (!LANG[key]) { return key }
  return Object.keys(props).length > 0 ?
    interpolate(LANG[key], props) :
    LANG[key]
}

/**
 * Gets the label for the provided metric ID
 * @param {string} id 
 * @return {string}
 */
export const getLabel = (id) => {
  return getLang('LABEL_' + id.toUpperCase());
}

/** Split a lang string at the variables */
export const splitLang = (text) =>
  text.split(/(\$\[[a-zA-Z0-9_]*\])/)

