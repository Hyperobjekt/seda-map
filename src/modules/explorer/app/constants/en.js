const LANG = {
  NO_DATA: 'Unavailable',
  NO_DATA_SHORT: '--',

  // Header
  LOGO_ALT_TEXT: 'Educational Opportunity Project',

  HEADER_TITLE_PREFIX: 'in $[0]',
  HEADER_TITLE_LARGEST: 'in the largest $[num] $[region]',

  // Mobile header
  MOBILE_SUBLINE: 'for $[demographic] in $[place] $[region]',

  // Menu
  MENU_HOME: 'Home',
  MENU_OPPORTUNITY: 'Opportunity Explorer',
  MENU_DISCOVERIES: 'Discoveries',
  MENU_ABOUT: 'About',
  MENU_FAQ: 'FAQ',
  MENU_METHODS: 'Methods',
  MENU_RESEARCH: 'Research',
  MENU_NEWS: 'In The News',
  MENU_DATA: 'Get The data',
  MENU_FACEBOOK: 'Educational Opportunity Project on Facebook',
  MENU_TWITTER: 'Educational Opportunity Project on Twitter',
  MENU_LINKEDIN: 'Educational Opportunity Project on LinkedIn',
  MENU_YOUTUBE: 'Educational Opportunity Project on YouTube',

  SHARE_TWITTER:
    'Explore educational opportunity in your community and around the country',

  // Footer
  FOOTER_COPYRIGHT: 'Copyright 2020',
  FOOTER_SHARE_LABEL: 'Share:',
  FOOTER_SHARE_FACEBOOK: 'Share on Facebook',
  FOOTER_SHARE_TWITTER: 'Share on Twitter',
  FOOTER_SHARE_LINK: 'Share Link',
  FOOTER_EMBED_LINK: 'Embed the map or chart',
  FOOTER_EXPORT_LABEL: 'Export:',
  FOOTER_EXPORT_PDF: 'PDF',
  FOOTER_EXPORT_PPT: 'Powerpoint',

  DATA_UNAVAILABLE: 'No data available',

  // UI Labels
  HELP_BUTTON: 'Help',
  UI_MAP_BUTTON: 'Map',
  UI_CHART_BUTTON: 'Chart',
  UI_SPLIT_BUTTON: 'Chart + map',
  UI_REPORT_LOADING:
    'Generating PDF report. Please be patient—this may take up to 30 seconds...',

  // Screen Reader Labels
  UI_MAP_BUTTON_SR: 'Go to map view',
  UI_CHART_BUTTON_SR: 'Go to chart view',
  UI_SPLIT_BUTTON_SR: 'Go to chart and map split view',
  UI_MAP_SR:
    'Map of $[region] in the United States, with colors showing $[metric] for $[demographic].',
  UI_CHART_SR:
    'Scatterplot with dots representing $[region] in the United States.  $[region] are positioned vertically on the Y axis based on $[yVar] and horizontally on the X axis based on $[xVar].',
  UI_LEGEND_BAR_SR:
    'A legend bar for $[title] showing $[lowValue] on the low end, $[midValue] in the middle, and $[highValue] on the high end.',
  UI_BRANDING_SR: 'Brought to you by Stanford University',

  // Metric Labels
  LABEL_AVG: 'average test scores',
  LABEL_GRD: 'learning rates',
  LABEL_COH: 'trend in test scores',
  LABEL_FRL: 'Free/Reduced Lunch',
  LABEL_SES: 'Socioeconomic Status',
  LABEL_SEG: 'school poverty',
  LABEL_MIN: 'percent minority students in schools',
  LABEL_SZ: 'Show largest',
  LABEL_SIZE: 'Show largest',

  // Concepts that correspond to metric
  LABEL_CONCEPT_AVG: 'educational opportunity',
  LABEL_CONCEPT_GRD: 'school effectiveness',
  LABEL_CONCEPT_COH: 'educational opportunity change',
  LABEL_REFLECTS_AVG: 'reflects educational opportunity',
  LABEL_REFLECTS_GRD: 'reflects school effectiveness',
  LABEL_REFLECTS_COH: 'reflects educational opportunity change',

  // Subgroup / Gap Labels
  LABEL_ALL_AVG: 'Average Test Scores',
  LABEL_W_AVG: "White students' average test scores",
  LABEL_B_AVG: "Black students' average test scores",
  LABEL_A_AVG: "Asian students' average test scores",
  LABEL_H_AVG: "Hispanic students' average test scores",
  LABEL_I_AVG: "Native American students' average test scores",
  LABEL_P_AVG: "Poor students' average test scores",
  LABEL_NP_AVG: "Non-poor students' average test scores",
  LABEL_M_AVG: "Male students' average test scores",
  LABEL_F_AVG: "Female students' average test scores",
  LABEL_WB_AVG: 'White / Black Gap in Test Scores',
  LABEL_WH_AVG: 'White / Hispanic Gap in Test Scores',
  LABEL_PN_AVG: 'Poor / Non-Poor Gap in Test Scores',
  LABEL_MF_AVG: 'Male / Female Gap in Test Scores',
  LABEL_ALL_GRD: 'Learning Rates',
  LABEL_W_GRD: "White students' learning rates",
  LABEL_B_GRD: "Black students' learning rates",
  LABEL_A_GRD: "Asian students' learning rates",
  LABEL_H_GRD: "Hispanic students' learning rates",
  LABEL_I_GRD: "Native American students' learning rates",
  LABEL_P_GRD: "Poor students' learning rates",
  LABEL_NP_GRD: "Non-poor students' learning rates",
  LABEL_M_GRD: "Male students' learning rates",
  LABEL_F_GRD: "Female students' learning rates",
  LABEL_WB_GRD: 'White / Black Gap in Learning Rates',
  LABEL_WH_GRD: 'White / Hispanic Gap in Learning Rates',
  LABEL_PN_GRD: 'Poor / Non-Poor Gap in Learning Rates',
  LABEL_MF_GRD: 'Male / Female Gap in Learning Rates',
  LABEL_ALL_COH: 'Trend in Test Scores',
  LABEL_W_COH: "White students' trend in test scores",
  LABEL_H_COH: "Hispanic students' trend in test scores",
  LABEL_I_COH: "Native American students' trend in test scores",
  LABEL_B_COH: "Black students' trend in test scores",
  LABEL_A_COH: "Asian students' trend in test scores",
  LABEL_P_COH: "Poor students' trend in test scores",
  LABEL_NP_COH: "Non-poor students' trend in test scores",
  LABEL_M_COH: "Male students' trend in test scores",
  LABEL_F_COH: "Female students' trend in test scores",
  LABEL_WB_COH: 'White / Black Gap in Test Score Trends',
  LABEL_WH_COH: 'White / Hispanic Gap in Test Score Trends',
  LABEL_PN_COH: 'Poor / Non-Poor Gap in Test Score Trends',
  LABEL_MF_COH: 'Male / Female Gap in Test Score Trends',
  LABEL_WB_MIN:
    'White / Black gap in Percent Minority Students in Schools',
  LABEL_WH_MIN:
    'White / Hispanic gap in Percent Minority Students in Schools',
  LABEL_NP_SEG: 'poor - non-poor gap in school poverty',
  LABEL_WB_SEG: 'Black - White gap in school poverty',
  LABEL_WH_SEG: 'Hispanic - White gap in school poverty',
  LABEL_ALL_SES: 'Socioeconomic Status',
  LABEL_W_SES: "White families' socioeconomic status",
  LABEL_B_SES: "Black families' socioeconomic status",
  LABEL_A_SES: "Asian families' socioeconomic status",
  LABEL_H_SES: "Hispanic families' socioeconomic status",
  LABEL_I_SES: "Native American families' socioeconomic status",
  LABEL_M_SES: '$[region] socioeconomic status',
  LABEL_F_SES: '$[region] socioeconomic status',
  LABEL_P_SES: '$[region] socioeconomic status',
  LABEL_NP_SES: '$[region] socioeconomic status',
  LABEL_WB_SES: 'White - Black gap in socioeconomic status',
  LABEL_WH_SES: 'White - Hispanic gap in socioeconomic status',
  LABEL_SES_NO_REGION: 'socioeconomic status',
  LABEL_SES_REGION: '$[region] socioeconomic status',
  LABEL_ALL_FRL: 'Free/Reduced Lunch',

  // Hints for metrics
  HINT_AVG:
    'How students score, in grade levels, relative to the national average for grades 3 - 8',
  HINT_GRD:
    "An average of how much students' test scores improve per year, relative to the national average, as they progress through grades 3 - 8",
  HINT_COH:
    "An average of how students' test scores change in grade levels per year, for grades 3 - 8 from 2009 - 2016",
  HINT_GAP_AVG: '',
  HINT_GAP_GRD: '',
  HINT_GAP_COH: '',

  // Demographic Labels
  LABEL_ALL: 'all',
  LABEL_B: 'Black',
  LABEL_W: 'White',
  LABEL_H: 'Hispanic',
  LABEL_I: 'Native American',
  LABEL_A: 'Asian',
  LABEL_M: 'male',
  LABEL_F: 'female',
  LABEL_P: 'poor',
  LABEL_NP: 'non-poor',
  LABEL_N: 'non-poor',

  // Gap Labels
  LABEL_WB: 'White - Black gap',
  LABEL_WH: 'White - Hispanic gap',
  LABEL_WI: 'White - Native American gap',
  LABEL_PN: 'non-poor - poor gap',
  LABEL_MF: 'male - female gap',
  LABEL_GAP: '$[demographic1] and $[demographic2]',

  // Abbreviated Gap Labels
  LABEL_SHORT_BW: 'White - Black',
  LABEL_SHORT_HW: 'White - Hispanic',
  LABEL_SHORT_IW: 'White - Native American',
  LABEL_SHORT_PN: 'poor - non-poor',
  LABEL_SHORT_FM: 'male - female',
  LABEL_SHORT_WB: 'White - Black',
  LABEL_SHORT_WH: 'White - Hispanic',
  LABEL_SHORT_WI: 'White - Native American',
  LABEL_SHORT_MF: 'male - female',

  // Demographic label for students
  LABEL_STUDENTS_ALL: 'all students',
  LABEL_STUDENTS_B: 'Black students',
  LABEL_STUDENTS_W: 'White students',
  LABEL_STUDENTS_H: 'Hispanic students',
  LABEL_STUDENTS_I: 'Native American students',
  LABEL_STUDENTS_A: 'Asian students',
  LABEL_STUDENTS_M: 'male students',
  LABEL_STUDENTS_F: 'female students',
  LABEL_STUDENTS_P: 'poor students',
  LABEL_STUDENTS_NP: 'non-poor students',
  LABEL_STUDENTS_N: 'non-poor students',
  LABEL_STUDENTS_WB:
    'difference between White and Black students',
  LABEL_STUDENTS_WH:
    'difference between White and Hispanic students',
  LABEL_STUDENTS_WI:
    'difference between White and Native American students',
  LABEL_STUDENTS_MF:
    'difference between male and female students',
  LABEL_STUDENTS_PN:
    'difference between non-poor and poor students',

  // Region Labels
  LABEL_STATES: 'states',
  LABEL_COUNTIES: 'counties',
  LABEL_DISTRICTS: 'school districts',
  LABEL_SCHOOLS: 'schools',
  LABEL_SINGULAR_STATES: 'state',
  LABEL_SINGULAR_COUNTIES: 'county',
  LABEL_SINGULAR_DISTRICTS: 'school district',
  LABEL_SINGULAR_SCHOOLS: 'school',

  // Gap Chart Label For Selection
  LABEL_GAP_INPUT: '$[dem1] - $[dem2] gap in',

  // Tooltips
  TOOLTIP_SUMMARY: 'Click on a location for more.',
  TOOLTIP_HINT: 'Click on a $[region] for more data.',

  // Tooltip description for demographics
  TOOLTIP_CONTEXT_ALL: 'for all students',
  TOOLTIP_CONTEXT_W: 'for White students',
  TOOLTIP_CONTEXT_B: 'for Black students',
  TOOLTIP_CONTEXT_H: 'for Hispanic students',
  TOOLTIP_CONTEXT_I: 'for Native American students',
  TOOLTIP_CONTEXT_A: 'for Asian students',
  TOOLTIP_CONTEXT_M: 'for male students',
  TOOLTIP_CONTEXT_F: 'for female students',
  TOOLTIP_CONTEXT_P: 'for poor students',
  TOOLTIP_CONTEXT_NP: 'for non-poor students',
  TOOLTIP_CONTEXT_WB: 'gap between White and Black',
  TOOLTIP_CONTEXT_WH: 'gap between White and Hispanic',
  TOOLTIP_CONTEXT_PN: 'gap between Poor and Non-poor',
  TOOLTIP_CONTEXT_MF: 'gap between make and female',

  // Description text below metric
  TOOLTIP_DESC_GRD_MID: 'equal to U.S. average',
  TOOLTIP_DESC_COH_MID: 'equal to U.S. average',
  TOOLTIP_DESC_AVG_MID: 'equal to U.S. average',
  TOOLTIP_DESC_AVG_HIGH: 'grades above U.S. average',
  TOOLTIP_DESC_GRD_HIGH: 'more learned each year',
  TOOLTIP_DESC_COH_HIGH: 'increase in scores per year',
  TOOLTIP_DESC_AVG_LOW: 'grades below U.S. average',
  TOOLTIP_DESC_GRD_LOW: 'less learned each year',
  TOOLTIP_DESC_COH_LOW: 'decrease in scores per year',
  TOOLTIP_DESC_FRL_HIGH: 'free/reduced price lunch',
  TOOLTIP_DESC_SES_ULTRA_HIGH: 'very far above national average',
  TOOLTIP_DESC_SES_VERY_HIGH: 'far above national average',
  TOOLTIP_DESC_SES_HIGH: 'above U.S. average',
  TOOLTIP_DESC_SES_MID: 'about average',
  TOOLTIP_DESC_SES_LOW: 'below national average',
  TOOLTIP_DESC_SES_VERY_LOW: 'far below national average',
  TOOLTIP_DESC_SES_ULTRA_LOW: 'very far below U.S. average',

  // Tooltip hints
  TOOLTIP_HINT_HIDE: 'hide side panel',
  TOOLTIP_HINT_SHOW: 'show data options',
  TOOLTIP_HINT_METRIC: 'click to change metric',
  TOOLTIP_HINT_REGION: 'click to change region',
  TOOLTIP_HINT_DEMOGRAPHIC: 'click to change subgroup or gap',
  TOOLTIP_HINT_FILTER: 'click to change filters',
  TOOLTIP_HINT_LOCATION: 'click to view selected locations',
  TOOLTIP_HINT_CHART: 'click to toggle the chart preview',

  TOOLTIP_SWITCH_AVG: 'Switch to Average Test Scores',
  TOOLTIP_SWITCH_GRD: 'Switch to Learning Rates',
  TOOLTIP_SWITCH_COH: 'Switch to Trends in Test Scores',
  TOOLTIP_SWITCH_GAP_AVG:
    'Switch to gaps in Average Test Scores',
  TOOLTIP_SWITCH_GAP_GRD: 'Switch to gaps in Learning Rates',
  TOOLTIP_SWITCH_GAP_COH: 'Switch to gaps in Test Score Trends',

  // Panels
  PANEL_TITLE_METRIC: 'Educational Opportunity Metric',
  PANEL_TITLE_DEMOGRAPHIC: 'Subgroup / Gap',
  PANEL_TITLE_REGION: 'Region',
  PANEL_TITLE_FILTER: 'Data Filters',
  PANEL_TITLE_LOCATION: 'Locations',
  PANEL_TITLE_STATE: 'Filter by State',
  PANEL_TITLE_LARGEST: 'Filter by Size',

  PANEL_FILTER_MANY: '$[num] filters applied',
  PANEL_FILTER_SINGLE: 'One filter applied',
  PANEL_FILTER_NONE: 'No filters applied',
  PANEL_LOCATION_MANY: '$[num] locations selected',
  PANEL_LOCATION_SINGLE: 'One location selected',
  PANEL_LOCATION_NONE: 'No locations selected',

  // Location Selection Panel
  LOCATIONS_ACTIVE_NONE:
    'You have not selected any $[region]. Use the search above or select $[region] in the map or chart view.',
  LOCATIONS_NONE: 'No $[region] selected.',

  // Location panel flags
  FLAG_SPED:
    'This school serves primarily special education students; keep in mind when interpreting test scores. See <a target="_blank" href="/help-faq/#data-adjustments">FAQ</a> for information.',
  FLAG_LEP:
    'This school serves primarily students with limited English proficiency (LEP); keep in mind when interpreting test scores. See <a target="_blank" href="/help-faq/#data-adjustments">FAQ</a> for information.',
  FLAG_GIFTED:
    'This school has a high percentage of gifted students; keep in mind when interpreting test scores. See <a target="_blank" href="/help-faq/#data-adjustments">FAQ</a> for information.',

  // Location Panel Summaries (Counties / Districts)
  SUMMARY_AVG_LOW:
    '$[name] provides <strong>lower than average</strong> educational opportunites.',
  SUMMARY_AVG_MID:
    '$[name] provides <strong>roughly average</strong> educational opportunites.',
  SUMMARY_AVG_HIGH:
    '$[name] provides <strong>higher than average</strong> educational opportunites.',

  SUMMARY_AVGSES_LOW:
    'Average scores are $[value] grade levels lower than $[region] with similar socioeconomic status.',
  SUMMARY_AVGSES_MID:
    'Average scores are equal to $[region] with similar socioeconomic status.',
  SUMMARY_AVGSES_HIGH:
    'Average scores are $[value] grade levels higher than $[region] with similar socioeconomic status.',
  SUMMARY_AVGSES_NONE: ' ',

  SUMMARY_GRD_LOW:
    '$[name] provides lower than average educational opportunities while children are in school.',
  SUMMARY_GRD_MID:
    '$[name] provides roughly average educational opportunities while children are in school.',
  SUMMARY_GRD_HIGH:
    '$[name] provides higher than average educational opportunities while children are in school.',

  SUMMARY_GRDSES_LOW:
    'Learning rates are $[value] lower than $[region] with similar socioeconomic status.',
  SUMMARY_GRDSES_MID:
    'Learning rates are equal to $[region] with similar socioeconomic status.',
  SUMMARY_GRDSES_HIGH:
    'Learning rates are $[value] higher than $[region] with similar socioeconomic status.',
  SUMMARY_GRDSES_NONE: ' ',

  SUMMARY_COH_LOW:
    '$[name] shows declining educational opportunity.',
  SUMMARY_COH_MID:
    '$[name] shows relatively stable educational opportunity.',
  SUMMARY_COH_HIGH:
    '$[name] shows improving educational opportunity.',

  SUMMARY_COHSES_LOW:
    'Average scores have declined by $[value] grade levels less than $[region] with similar socioeconomic status.',
  SUMMARY_COHSES_MID:
    'Trends in test scores are similar to $[region] with similar socioeconomic status.',
  SUMMARY_COHSES_HIGH:
    'Average scores have improved by $[value] grade levels more than $[region] with similar socioeconomic status.',
  SUMMARY_COHSES_NONE: ' ',

  // Location Panel Summaries (Schools)
  SUMMARY_SCHOOL_AVG_LOW:
    'The children attending $[name] have <strong>lower than average</strong> educational opportunites.',
  SUMMARY_SCHOOL_AVG_MID:
    'The children attending $[name] have <strong>roughly average</strong> educational opportunites.',
  SUMMARY_SCHOOL_AVG_HIGH:
    'The children attending $[name] have <strong>higher than average</strong> educational opportunites.',

  SUMMARY_AVGFRL_LOW:
    'Average scores are $[value] grade levels lower than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_AVGFRL_MID:
    'Average scores are equal to $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_AVGFRL_HIGH:
    'Average scores are $[value] grade levels higher than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_AVGFRL_NONE: ' ',

  SUMMARY_SCHOOL_GRD_LOW:
    '$[name] provides lower than average educational opportunities while children are in school.',
  SUMMARY_SCHOOL_GRD_MID:
    '$[name] provides roughly average educational opportunities while children are in school.',
  SUMMARY_SCHOOL_GRD_HIGH:
    '$[name] provides higher than average educational opportunities while children are in school.',

  SUMMARY_GRDFRL_LOW:
    'Learning rates are $[value] lower than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_GRDFRL_MID:
    'Learning rates are equal to $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_GRDFRL_HIGH:
    'Learning rates are $[value] higher than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_GRDFRL_NONE: ' ',

  SUMMARY_SCHOOL_COH_LOW:
    'Educational opportunities for the children attending $[name] declined in the years 2009-2016.',
  SUMMARY_SCHOOL_COH_MID:
    'Educational opportunities for the children attending $[name] were roughly stable in the years 2009-2016',
  SUMMARY_SCHOOL_COH_HIGH:
    'Educational opportunities for the children attending $[name] improved in the years 2009-2016.',

  SUMMARY_COHFRL_LOW:
    'Average scores have declined by $[value] grade levels less than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_COHFRL_MID:
    'Trends in test scores are similar to $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_COHFRL_HIGH:
    'Average scores have improved by $[value] grade levels more than $[region] with similar free/reduced-price lunch percentage.',
  SUMMARY_COHFRL_NONE: ' ',

  SUMMARY_AVG_NONE:
    'No community educational opportunity data for $[name].',
  SUMMARY_GRD_NONE:
    'No school-based opportunity data for $[name].',
  SUMMARY_COH_NONE:
    'No change in community educational opportunity data for $[name].',
  SUMMARY_SES_NONE: '',
  SUMMARY_FRL_NONE: '',

  BUTTON_DOWNLOAD_REPORT: 'Download Report',

  LOCATION_COMPARE_FEATURES_TITLE: '$[region] Comparison',
  LOCATION_COMPARE_FEATURES_NONE:
    'Select another place from the map, chart, or search to compare it with $[name].',
  LOCATION_COMPARE_FEATURES:
    'Below are your previous location selections.  The arrows mark where $[name] falls on the scale.',
  LOCATION_EXPORT_REPORT_TITLE: 'Export a Report',
  LOCATION_EXPORT_REPORT: `Press the button below to generate a PDF report about educational opportunity in $[name].`,
  LOCATION_DIFFERENCES_TITLE: 'Opportunity Differences',
  LOCATION_DIFFERENCES: '',
  LOCATION_SIMILAR_PLACES_TITLE: 'Similar $[region]',
  LOCATION_SIMILAR_PLACES: `The following places are similar to $[name] based on size, socioeconomic status, and other factors:`,
  LOCATION_SIMILAR_PLACES_SUMMARY:
    'Find places similar to $[name] based on size, socioeconomic status:',
  LOCATION_SIMILAR_SHOW: 'Show similar places',
  LOCATION_SHOW_PLACE: 'Show data for $[name]',

  LOCATION_SHOW_AVG: 'more details on average test scores',
  LOCATION_SHOW_GRD: 'more details on learning rates',
  LOCATION_SHOW_COH: 'more details on test score trends',
  LOCATION_HIDE_AVG: 'hide details on average test scores',
  LOCATION_HIDE_GRD: 'hide details on learning rates',
  LOCATION_HIDE_COH: 'hide details on test score trends',

  // Description of metric value for location
  VALUE_AVG_HIGH:
    '$[students] score <strong>$[value] grade levels above</strong> U.S. average.',
  VALUE_AVG_MID:
    "$[students]' test scores are at the national average.",
  VALUE_AVG_LOW:
    '$[students] score <strong>$[value] grade levels below</strong> U.S. average.',
  VALUE_GRD_HIGH:
    '$[students] learn <strong>$[value] more each grade</strong> than the U.S. average.',
  VALUE_GRD_MID:
    '$[students] learn the same each grade as the U.S. average.',
  VALUE_GRD_LOW:
    '$[students] learn <strong>$[value] less each grade</strong> than the U.S. average.',
  VALUE_COH_HIGH:
    "$[students]' test scores <strong>increased an average of $[value] grade levels</strong> each year from 2009-2016.",
  VALUE_COH_MID:
    "$[students]' test scores were stable from 2009-2016.",
  VALUE_COH_LOW:
    "$[students]' test scores <strong>decreased an average of $[value] grade levels</strong> each year from 2009-2016.",

  VALUE_SES_ULTRA_HIGH:
    'Socioeconomic status is <strong>very far above national average</strong>.',
  VALUE_SES_VERY_HIGH:
    'Socioeconomic status is <strong>far above national average</strong>.',
  VALUE_SES_HIGH:
    'Socioeconomic status is <strong>above national average</strong>.',
  VALUE_SES_MID:
    'Socioeconomic status is <strong>about average</strong>.',
  VALUE_SES_LOW:
    'Socioeconomic status is <strong>below national average</strong>.',
  VALUE_SES_VERY_LOW:
    'Socioeconomic status is <strong>far below national average</strong>.',
  VALUE_SES_ULTRA_LOW:
    'Socioeconomic status is <strong>very far below national average</strong>.',

  VALUE_FRL:
    '<strong>$[value] of students</strong> qualify for free or reduced lunch program.',

  VALUE_SEG: '<strong>$[value] school poverty</strong>',

  // Description of gap value for location
  VALUE_AVG_GAP:
    '$[demographic1] and $[demographic2] students’ average scores differ by $[value] grade levels.',
  VALUE_GRD_GAP:
    '$[demographic1] and $[demographic2] students’ learning rates differ by $[value] per year.',
  VALUE_COH_GAP:
    '$[demographic1] and $[demographic2] students’ test score trends differ by $[value] grade levels per year.',
  VALUE_SES_GAP:
    '$[demographic1] students’ average socioeconomic status is $[difference] $[demographic2] students’.',
  // 'VALUE_SEG_GAP': 'Poverty rate in $[demographic2] students’ schools are $[value] $[highLow] than $[demographic1] students’ schools.',
  VALUE_SEG_GAP:
    'The poverty rate in $[demographic2] students’ schools is $[value] $[highLow] than in $[demographic1] students’ schools.',
  VALUE_MIN_GAP:
    'The percent of minority students in $[demographic2] students’ schools is $[value] $[highLow] than in $[demographic1] students’ schools.',

  DIFF_VERY_HIGH: 'much higher than',
  DIFF_HIGH: 'higher than',
  DIFF_MID: 'roughly equal to',
  DIFF_LOW: 'lower than',
  DIFF_VERY_LOW: 'much lower than',

  // Scatterplot Titles
  SP_TITLE_AVG_SES:
    'Educational Opportunity vs. Socioeconomic Status',
  SP_TITLE_AVG_FRL:
    'Educational Opportunity vs. % Free or Reduced Lunch Program ',
  SP_TITLE_GRD_SES:
    'School Effectiveness vs. Socioeconomic Status',
  SP_TITLE_GRD_FRL:
    'School Effectiveness vs. % Free or Reduced Lunch Program',
  SP_TITLE_COH_SES:
    'Changes in Educational Opportunity and Socioeconomic Status',
  SP_TITLE_COH_FRL:
    'Changes in Educational Opportunity and % Free or Reduced Lunch Program',
  SP_TITLE_AVG_SES_GAP:
    'Differences in Educational Opportunity vs. Socioeconomic Status',
  SP_TITLE_GRD_SES_GAP:
    'Differences in School Effectiveness vs. Socioeconomic Status',
  SP_TITLE_COH_SES_GAP:
    'Differences in Educational Opportunity Change and Socioeconomic Status',

  SP_TITLE: '$[metric] vs. $[secondary]',
  SP_TITLE_GAP: 'Difference in $[metric] vs. $[secondary]',
  SP_TITLE_VS: 'Differences in $[metric]',
  SP_SUBTITLE:
    '$[place] $[region], $[demographic], grades 3 - 8 from 2009 - 2016, sized by number of students',

  OP_TITLE_AVG:
    'Achievement Differences Between $[dem1] and $[dem2]',
  OP_TITLE_GRD: 'Growth Differences Between $[dem1] and $[dem2]',
  OP_TITLE_COH:
    'Change in Achievement Differences Between $[dem1] and $[dem2]',

  // Axis Names
  AXIS_NAME_FRL_PCT:
    '% of students qualifying for free or reduced lunch program',
  AXIS_NAME_SES: '',

  // Axis Labels
  AXIS_AVG_MID: 'national\naverage',
  AXIS_AVG_LOW_SINGLE: '$[value] grade\nbelow',
  AXIS_AVG_LOW: '$[value] grades\nbelow',
  AXIS_AVG_HIGH_SINGLE: '$[value] grade\nabove',
  AXIS_AVG_HIGH: '$[value] grades\nabove',

  AXIS_GRD_MID_SINGLE: 'learned 1 grade\nlevel per year',
  AXIS_GRD_LOW_SINGLE: 'learned\n$[value] less',
  AXIS_GRD_LOW: 'learned\n$[value] less',
  AXIS_GRD_HIGH_SINGLE: 'learned\n$[value] more',
  AXIS_GRD_HIGH: 'learned\n$[value] more',

  AXIS_COH_MID: 'no\nchange',
  AXIS_COH_LOW_SINGLE: 'dropped $[value]\ngrade level',
  AXIS_COH_LOW: 'declined $[value]\ngrade levels / year',
  AXIS_COH_HIGH_SINGLE: 'improved $[value]\ngrade level / year',
  AXIS_COH_HIGH: 'improved $[value]\ngrade levels / year',

  AXIS_AVG_GAP_MID: 'no\ngap',
  AXIS_AVG_GAP_LOW_SINGLE: '$[value] grade level\ndifference',
  AXIS_AVG_GAP_LOW: '-$[value] grade level\ndifference',
  AXIS_AVG_GAP_HIGH_SINGLE: '$[value] grade level\ndifference',
  AXIS_AVG_GAP_HIGH: '+$[value] grade level\ndifference',

  AXIS_GRD_GAP_MID: 'no\n difference',
  AXIS_GRD_GAP_LOW:
    '-$[value] grade levels\nper year difference',
  AXIS_GRD_GAP_HIGH:
    '$[value] grade levels\nper year difference',

  AXIS_COH_GAP_MID: 'no\ndifference',
  AXIS_COH_GAP_LOW:
    '-$[value] grade levels\nper year difference',
  AXIS_COH_GAP_HIGH:
    '$[value] grade levels\nper year difference',

  AXIS_SES_MID: 'national\naverage',
  AXIS_SES_LOW: 'poorer',
  AXIS_SES_HIGH: 'richer',

  AXIS_SES_ZERO_GAP: 'no gap in\nsocioeconomic status',
  AXIS_SES_LOW_GAP: '$[demographic1] richer',
  AXIS_SES_HIGH_GAP: '$[demographic2] richer',
  AXIS_SES_GAP_MID: 'no\ngap',

  AXIS_SEG_MID: 'no\ngap',
  AXIS_SEG_LOW: 'less',
  AXIS_SEG_HIGH: 'more',

  AXIS_SEG_GAP_MID: 'no gap',
  AXIS_SEG_LOW_GAP: 'less',
  AXIS_SEG_HIGH_GAP: 'more',

  AXIS_MIN_GAP_MID: 'no gap',
  AXIS_MIN_GAP_HIGH: '$[value]',

  AXIS_FRL_MID: ' ',

  // PREVIEW CHART AXIS LABELS
  AXIS_PREV_ZERO: '',
  AXIS_PREV_MID: '',
  AXIS_PREV_HIGH_SINGLE: '',

  // LINE FOR VERSUS CHART
  LINE_EQUAL_OPPORTUNITY:
    'no gap ($[demographic1] = $[demographic2])',

  // BUTTON TO TOGGLE SECONDARY CHART
  BUTTON_SHOW_CHART: 'Show gap vs. other metrics',
  BUTTON_HIDE_CHART: 'Hide gap chart',

  SEARCH_PLACEHOLDER: 'Find a city, county, district, or school',

  // Map Legend (Mobile)
  LEGEND_LOW: 'lower',
  LEGEND_HIGH: 'higher',
  LEGEND_LOW_AVG: 'below grade level',
  LEGEND_HIGH_AVG: 'above grade level',
  LEGEND_LOW_GRD: 'learns less',
  LEGEND_HIGH_GRD: 'learns more',
  LEGEND_LOW_COH: 'scores dropping',
  LEGEND_HIGH_COH: 'scores improving',
  LEGEND_LOW_SES: 'poorer',
  LEGEND_HIGH_SES: 'richer',
  LEGEND_LOW_FRL: 'more poverty',
  LEGEND_HIGH_FRL: 'less poverty',

  LEGEND_SHORT_LOW_AVG: 'lower',
  LEGEND_SHORT_HIGH_AVG: 'higher',
  LEGEND_SHORT_LOW_GRD: 'lower',
  LEGEND_SHORT_HIGH_GRD: 'higher',
  LEGEND_SHORT_LOW_COH: 'lower',
  LEGEND_SHORT_HIGH_COH: 'higher',
  LEGEND_SHORT_LOW_SES: 'poorer',
  LEGEND_SHORT_HIGH_SES: 'richer',
  LEGEND_SHORT_LOW_FRL: 'high poverty',
  LEGEND_SHORT_HIGH_FRL: 'low poverty',

  FOOTNOTE_CHART_SIZE:
    'Circle size reflects number of students.',
  FOOTNOTE_CHART_VS:
    'Dotted line indicates no gap ($[yDem] = $[xDem]).',
  FOOTNOTE_CHART_VS2:
    '$[region] above dotted line indicate a gap favoring $[yDem] students.',
  FOOTNOTE_CHART_GAP:
    '$[region] above or to the right of the "no gap" line have a gap favoring $[yDem].',
  FOOTNOTE_CHART_FILTER:
    '$[largest] $[region] in $[parentLocation] are highlighted.',

  // Average test score gaps
  LEGEND_LOW_AVG_WB: ' ',
  LEGEND_HIGH_AVG_WB: ' ',
  LEGEND_LOW_AVG_WH: ' ',
  LEGEND_HIGH_AVG_WH: ' ',
  LEGEND_LOW_AVG_PN: ' ',
  LEGEND_HIGH_AVG_PN: ' ',
  LEGEND_LOW_AVG_MF: ' ',
  LEGEND_HIGH_AVG_MF: ' ',

  // Learning rate gaps
  LEGEND_LOW_GRD_WB: ' ',
  LEGEND_HIGH_GRD_WB: ' ',
  LEGEND_LOW_GRD_WH: ' ',
  LEGEND_HIGH_GRD_WH: ' ',
  LEGEND_LOW_GRD_PN: ' ',
  LEGEND_HIGH_GRD_PN: ' ',
  LEGEND_LOW_GRD_MF: ' ',
  LEGEND_HIGH_GRD_MF: ' ',

  // Trend in scores gaps
  LEGEND_LOW_COH_WB: ' ',
  LEGEND_HIGH_COH_WB: ' ',
  LEGEND_LOW_COH_WH: ' ',
  LEGEND_HIGH_COH_WH: ' ',
  LEGEND_LOW_COH_PN: ' ',
  LEGEND_HIGH_COH_PN: ' ',
  LEGEND_LOW_COH_MF: ' ',
  LEGEND_HIGH_COH_MF: ' ',

  // SES gaps
  LEGEND_LOW_SES_WB: ' ',
  LEGEND_HIGH_SES_WB: ' ',
  LEGEND_LOW_SES_WH: ' ',
  LEGEND_HIGH_SES_WH: ' ',

  // SEG gaps
  LEGEND_LOW_SEG_WB: ' ',
  LEGEND_HIGH_SEG_WB: 'More Racial-Economic School Segregation',
  LEGEND_LOW_SEG_WH: ' ',
  LEGEND_HIGH_SEG_WH: 'More Racial-Economic School Segregation',
  LEGEND_LOW_SEG: ' ',
  LEGEND_HIGH_SEG: 'More Racial-Economic School Segregation',
  LEGEND_LOW_MIN_WH: ' ',
  LEGEND_HIGH_MIN_WH: 'More Racial School Segregation',
  LEGEND_LOW_MIN_WB: ' ',
  LEGEND_HIGH_MIN_WB: 'More Racial School Segregation',

  // Map Legend
  LEGEND_MAP_AVG: 'Average Test Scores for $[0]',
  LEGEND_MAP_GRD: 'Learning Rates for $[0]',
  LEGEND_MAP_COH: 'Trend in Test Scores for $[0]',
  LEGEND_MAP_GAP_AVG: '$[0] in Average Test Scores',
  LEGEND_MAP_GAP_GRD: '$[0] in Learning Rates',
  LEGEND_MAP_GAP_COH: '$[0] in Test Score Trends',

  // Text descriptions
  LEGEND_DESC_AVG:
    'in grade levels, relative to the U.S. average',
  LEGEND_DESC_GRD:
    'amount learned per grade, relative to U.S. average',
  //'LEGEND_DESC_COH': 'Colors show how many grade levels $[demographic] students\' test scores changed per year from 2009 - 2016.',
  LEGEND_DESC_COH:
    'in grade levels, how much test scores change each year',
  LEGEND_DESC_GAP_AVG:
    'below zero = higher $[1] scores, above zero = higher $[0] scores',
  LEGEND_DESC_GAP_GRD:
    'below zero = $[1] learns more, above zero = $[0] learns more',
  LEGEND_DESC_GAP_COH:
    'below zero = gap is decreasing, above zero = gap is increasing',

  LEGEND_MID_AVG: 'U.S. average',
  LEGEND_MID_GRD: 'U.S. average',
  LEGEND_MID_COH: 'no change',
  LEGEND_MID_GAP_AVG: '0',
  LEGEND_MID_GAP_GRD: '0',
  LEGEND_MID_GAP_COH: '0',

  LEGEND_CHART_INTERACTIVE:
    'Go to the expanded chart to explore interactively:',
  LEGEND_CHART_BUTTON: 'Show Interactive Chart',

  FILTER_RESET: 'Reset Data Filters',
  FILTER_PREFIX_STATES: 'Filter by state',
  FILTER_PREFIX_COUNTIES: 'Filter by county',
  FILTER_PREFIX_DISTRICTS: 'Filter by district',
  FILTER_LARGEST: 'Filter by size',
  FILTER_LARGEST_SELECTION: 'Largest $[num] $[region]',
  FILTER_LABEL_LOCATION: 'Show $[region] within',
  FILTER_LABEL_SIZE: 'Show Largest',
  FILTER_LABEL_AVG: 'Average Test Score Range',
  FILTER_LABEL_GRD: 'Learning Rate Range',
  FILTER_LABEL_COH: 'Trend in Test Score Range',
  FILTER_LABEL_SES: 'Socioeconomic Status Range',
  FILTER_LABEL_FRL: 'Free/Reduced Lunch Program Range',
  FILTER_LABEL_SCHOOL_TYPE: 'Show School Types',
  FILTER_PLACEHOLDER_SCHOOLS: 'Search for a state or district',
  FILTER_PLACEHOLDER_DISTRICTS: 'Search for a state',
  FILTER_PLACEHOLDER_COUNTIES: 'Search for a state',
  FILTER_PLACEHOLDER_STATES: 'Unavailable',
  FILTER_HINT_LOCATION:
    'Show $[regions] within the below location',
  FILTER_HINT_SIZE:
    'Limit the number of $[regions] shown by number of students',
  FILTER_HINT_AVG:
    'measured in grade levels relative to national average',
  FILTER_HINT_GRD:
    'measured by average test score improvement each grade as student progresses',
  FILTER_HINT_COH:
    'measured by average change in cohort test scores each year',
  FILTER_HINT_SES:
    'measured in standard deviations from average',
  FILTER_HINT_FRL:
    'show schools within this range of % qualifying for free or reduced lunch program',

  SCHOOL_TYPE_MIDDLE: 'Middle Schools',
  SCHOOL_TYPE_ELEMENTARY: 'Elementary Schools',
  SCHOOL_TYPE_COMBINED: 'Combined Schools',
  SCHOOL_TYPE_CHARTER: 'Charter Schools',
  SCHOOL_TYPE_PUBLIC: 'Traditional Public Schools',
  SCHOOL_TYPE_MAGNET: 'Magnet Schools',
  SCHOOL_TYPE_RURAL: 'Rural Schools',
  SCHOOL_TYPE_SUBURBAN: 'Suburban Schools',
  SCHOOL_TYPE_URBAN: 'Urban Schools',

  HELP_PANEL_TITLE: 'Help',
  HELP_PANEL_HOW_TAB: 'How to explore',
  HELP_PANEL_WHAT_TAB: 'What am I seeing',

  // What am I seeing labels
  HP_MAP: 'map',
  HP_CHART: 'chart',
  HP_SPLIT: 'map and chart',
  HP_SES: 'socioeconomic status',

  HELP_CURRENT: 'Current View',
  HELP_OTHER: 'More Help',
  HELP_HOW_TO: 'How to use the explorer',

  HELP_LEGEND_LOW_AVG: 'lower',
  HELP_LEGEND_HIGH_AVG: 'higher',
  HELP_LEGEND_LOW_GRD: 'lower',
  HELP_LEGEND_HIGH_GRD: 'higher',
  HELP_LEGEND_LOW_COH: 'lower',
  HELP_LEGEND_HIGH_COH: 'higher',

  HELP_LEGEND_VAL_AVG_LOW:
    '$[students] score $[value] grade levels below average',
  HELP_LEGEND_VAL_AVG_MID: 'national average',
  HELP_LEGEND_VAL_AVG_HIGH:
    '$[students] score $[value] grade levels above average',

  HELP_LEGEND_VAL_GRD_LOW:
    '$[students] learn $[value] less per grade than average',
  HELP_LEGEND_VAL_GRD_MID: 'national average',
  HELP_LEGEND_VAL_GRD_HIGH:
    '$[students] learn $[value] more per grade than average',

  HELP_LEGEND_VAL_COH_LOW:
    "$[students]' average test scores decline $[value] grade levels per year",
  HELP_LEGEND_VAL_COH_MID: 'no change',
  HELP_LEGEND_VAL_COH_HIGH:
    "$[students]' average test scores improve $[value] grade levels per year",

  HELP_LEGEND_VAL_AVG_GAP_LOW:
    'Difference of $[value] grade levels in favor of $[students].',
  HELP_LEGEND_VAL_AVG_GAP_MID: 'No difference',
  HELP_LEGEND_VAL_AVG_GAP_HIGH:
    'Difference of $[value] grade levels in favor of $[students].',

  HELP_LEGEND_VAL_GRD_GAP_LOW:
    'Difference of $[value] in learning rates in favor of $[students].',
  HELP_LEGEND_VAL_GRD_GAP_MID: 'No difference',
  HELP_LEGEND_VAL_GRD_GAP_HIGH:
    'Difference of $[value] in learning rates in favor of $[students].',

  HELP_LEGEND_VAL_COH_GAP_LOW:
    'Difference of $[value] in trend of test scores in favor of $[students].',
  HELP_LEGEND_VAL_COH_GAP_MID: 'No difference',
  HELP_LEGEND_VAL_COH_GAP_HIGH:
    'Difference of $[value] in trend of test scores in favor of $[students].',

  HELP_MAP: 'What Does the Map Show?',
  HELP_MAP_DESC:
    'This map of $[region] in $[state] shows $[metric] for $[demographic], on a scale $[metricDescription].',
  HELP_MAP_DESC_GAP:
    'This map of $[region] in $[state] shows the $[gap] in $[metric].',
  HELP_MAP_AVG_OVERVIEW:
    "Average scores reflect more than just how well schools educate children; they reveal the full range of educational opportunities, both in and out of school. (To better understand schools' contributions, see learning rates.)",
  HELP_MAP_GRD_OVERVIEW:
    'Learning rates measure how much student scores improve each year while they are in school. This is a better way to assess what children learn in schools than average test scores, which are heavily influenced by factors outside of school.',
  HELP_MAP_COH_OVERVIEW:
    'Average student test scores are influenced by children’s home environments, early childhood experiences, community resources, and schools. The trend (or change) in average student test scores from one year to the next indicates whether educational opportunities are improving or declining in a community.',

  HELP_CHART: 'What Does the Chart Show?',
  HELP_CHART_DOTS:
    'Each circle represents a $[region]. The circle’s size shows the number of $[demographic] students.',
  HELP_CHART_Y:
    'This chart of $[region] in $[state] shows, on the vertical (Y) axis, $[metric] for $[demographic] on a scale $[metricDescription].',
  HELP_CHART_X_SES:
    'The horizontal (X) axis shows the $[region]’s socioeconomic status (SES), which is a broad measure of the economic and social resources available in a community.',
  HELP_CHART_X_FRL:
    'The horizontal (X) axis shows the percentage of students at the school who are eligible for the Federal Free & Reduced Price Lunch Program.',
  HELP_CHART_PRIMARY:
    'The primary chart shows a comparison of $[demographic1] and $[demographic2] students’ $[metric]. Each circle represents a $[region] in $[state]. The circle’s size shows the number of students. The vertical (Y) axis shows $[metricRange] for $[demographic2] students, on a scale $[metricDescription]. The horizontal (X) axis shows the same for $[demographic1] students.',
  HELP_CHART_SECONDARY:
    'The chart on the right shows the $[gap] in $[metric] on the vertical (Y) axis. The higher up the axis, the larger the gap. The horizontal (X) axis shows the gap in $[secondary] between these two groups. The farther to the right, the larger the gap favors $[demographic1] families. Each circle represents a $[region] in $[state]. The circle’s size shows the number of students.',

  HELP_DATA_OVERVIEW:
    'The test scores represented here were collected in grades 3-8 from 2008-09 through 2015-16 at public elementary and middle schools in the U.S.',

  HELP_DESC_AVG: 'the range of average test scores',
  HELP_DESC_AVG_DETAILS:
    'of grade levels above and below the national average',
  HELP_DESC_GRD: 'the range of learning rates',
  HELP_DESC_GRD_DETAILS:
    'representing how much students learned in school relative to the national average',
  HELP_DESC_COH: 'Trend in Test Scores',
  HELP_DESC_COH_DETAILS:
    'representing how much average test scores have improved or declined over time',

  HELP_AVG_CONCEPT:
    'Why Do Average Test Scores Show Educational Opportunities in and out of School?',
  HELP_GRD_CONCEPT:
    'Why Do Average Learning Rates Largely Reflect a School’s Effectiveness?',
  HELP_COH_CONCEPT:
    "How Do Trends in Test Scores Show Changes in a  Community's Educational Opportunities?",

  HELP_AVG: 'How Are Average Test Scores Calculated?',
  HELP_GRD: 'How Are Learning Rates Calculated?',
  HELP_COH: 'How Are Trends in Test Scores Calculated?',
  HELP_SES:
    'What Is Socioeconomic Status and How Is It Calculated?',
  HELP_SEG:
    'What Is the Gap in School Poverty and How Is It Calculated?',
  HELP_FRL:
    'How Is the Free/Reduced-Price Lunch Percentage Calculated and What Does It Mean?',
  HELP_MIN:
    'What Is the Gap in Percent Minority Students in Schools and How Is It Calculated?',

  HELP_AVG_CONCEPT_A: `Average student test scores are influenced by opportunities to learn at home, in neighborhoods, in child-care, preschool, and after-school programs, from peers and friends, and in schools. Because of all these influences, average test scores are not a good way to assess how much children learn in schools. But they are a good way to assess the average set of educational opportunities available to children in a community. Where average scores are low, students have fewer opportunities to learn. Schools are better evaluated using learning rates, which measure how much students’ scores improve while they are in school.`,
  HELP_GRD_CONCEPT_A: `Learning rates measure how much students’ scores improve each year while they are in school. This is a better way to assess what children learn in schools than average test scores, which are heavily influenced by factors outside of school. To understand the distinction, think of a hospital: We wouldn’t assess a hospital based on the health of its patients; rather, we’d judge it on how much the health of patients improves as a result of their time in the hospital. Similarly, we shouldn’t evaluate a school based on the average scores of its students, but rather by how much their scores improve while in school.`,
  HELP_COH_CONCEPT_A: `Average student test scores are influenced by home environments, early childhood experiences, community resources, and schools. The trend (or change) in average student test scores from one year to the next indicates whether educational opportunities are improving or declining in a community. Where the trend is positive, students’ opportunities to learn are improving. Opportunities may improve over time because of changes in school quality or because of changes in family resources, home environments, early childhood experiences, and/or community resources.`,

  HELP_AVG_A: `The average test score is based on the average of standardized math and English Language Arts (ELA) tests taken by public-school students in grades 3 through 8 between 2009 and 2016. See the <a href="/help-faq/#how-measures-computed" target="_blank">FAQ</a> for more detail.`,
  HELP_GRD_A: `The learning rate is based on changes in average test scores from each year and grade to the next year and grade (e.g. changes from 2015 3rd-grade scores to 2016 4th-grade scores). The learning rates are calculated using standardized math and English Language Arts (ELA) tests taken by public school students in grades 3 through 8 between 2009 and 2016. See the <a href="/help-faq/#how-measures-computed" target="_blank">FAQ</a> for more detail.`,
  HELP_COH_A: `The trend in test scores is based on changes in average test scores from each year to the next in the same grade (e.g. changes from 2015 3rd-grade scores to 2016 3rd-grade scores). The test-score trends are calculated using standardized math and English Language Arts (ELA) tests taken by public-school students in grades 3 through 8 between 2009 and 2016. See the <a href="/help-faq/#how-measures-computed" target="_blank">FAQ</a> for more detail.`,
  HELP_SES_A: `Socioeconomic status (SES) is a broad measure of the economic and social resources available in a community. It is based on information about the income, educational attainment, employment, and structure of all families living in the community served by a school district or county. This information is combined into a single composite rating for each community. A rating of 0 represents the national average of socioeconomic status; higher ratings represent more affluent communities. See the <a href="/help-faq/#ses-measured" target="_blank">FAQ</a> for more detail. `,
  HELP_SEG_A: `The gap in school poverty is a measure of school segregation. We use the proportion of students defined as “economically disadvantaged” in a school as a measure of school poverty. The black-white gap in school poverty, for example, measures the difference between the poverty rate of the average black student’s school and the poverty rate of the average white student’s school. When there is no segregation—when white and black students attend the same schools, or when white and black students’ schools have equal poverty rates—the black-white school poverty gap is 0. A positive black-white school poverty gap means that black students’ schools have higher poverty rates than white students’ schools, on average. A negative black-white school poverty gap means that white students’ schools have higher poverty rates than black students’ schools, on average.`,
  HELP_FRL_A: `The free/reduced-price lunch percentage measures the proportion of students in the school who are eligible for free or reduced-price lunches through the National School Lunch Program. Students are eligible for free or reduced-price lunches if their family income is below 185% of the poverty threshold. A school with a free lunch rate of 0% has no poor or near-poor students; the higher the free lunch rate, the greater the number of poor students. The lower the free/reduced-price lunch percentage, the more affluent the school.`,
  HELP_MIN_A: `The gap in percent minority students in schools (shown in the secondary gap charts) is a measure of school segregation. Percent minority students in schools is measured as the proportion of minority students (black students plus Hispanic students) in a student’s school. The black-white gap in percent minority students in schools then measures the difference between the proportion of minority students in the average black student’s school and the proportion of minority students in the average white student’s school. When there is no segregation—when white and black students attend the same schools, or when white and black students’ schools have equal proportions of minority students—the black-white gap in percent minority students is 0. A positive black-white gap in percent minority students means that black students’ schools have higher shares of minority students than white students’ schools, on average. A negative black-white gap in percent minority students means that white students’ schools have higher shares of minority students than black students’ schools, on average.`,

  HELP_HOW_Q1:
    'What are the Different Ways of Exploring the Data?',
  HELP_HOW_Q2: 'What Data Can I Choose From?',
  HELP_HOW_Q3: 'What Do the Colors in the Map and Charts Mean?',
  HELP_HOW_Q4: 'What Kinds of Locations Can I View?',
  HELP_HOW_Q5: 'How Can I Find a Location and View Its Data?',
  HELP_HOW_Q6: 'How Many Locations Can I Select at Once?',
  HELP_HOW_Q7:
    'How Do I See All the Data for a Location at Once?',
  HELP_HOW_Q8: 'How Do I View Data on Comparable Locations?',
  HELP_HOW_Q9:
    'How Can I See Data on Gaps Between Demographic Groups?',
  HELP_HOW_Q10:
    'How Do I Export a Report About My Selected Location?',
  HELP_HOW_Q11:
    'Where Can I Get More Help & Info About Educational Opportunity?',
  HELP_HOW_Q12: 'How Can I Download the Data?',

  HELP_HOW_Q1_A: `The Educational Opportunity Explorer offers three different ways of looking at educational opportunity in the U.S.: a map, a chart, and a “split screen” view of both. Use the <strong>Map | Chart | Map + Chart</strong> buttons in the tool to select one of these views.`,
  HELP_HOW_Q2_A: `<p>At the top of this Explorer, you can select from <strong>3 Key Measures</strong> of educational opportunity to display in the map and chart:</p>
    <ul>
      <li>Average test scores, which reflect educational opportunities in and out of school</li>
      <li>Learning rates, which reflect school effectiveness</li>
      <li>Trends in test scores, which reflect changes in educational opportunity</li>
    </ul>
    <p>Just below these buttons, you can use the <strong>“Showing …”</strong> drop-down menus to filter by demographic (e.g. “all students” or “female students”) or the gap between demographics (e.g. “male-female gap”), and the type of places (counties, school districts, or schools) you’d like to display. In the Chart view, you can choose to view data for the entire country , or individual U.S. states.</p>`,
  HELP_HOW_Q3_A: `
    <p>Light gray represents the national average, or “no change” (for trends in test scores).</p>
    <p>The deeper the green, the farther above the national average—or, for trends in test scores, the greater the improvement in scores over time.</p>
    <p>The deeper the blue, the farther below the national average—or for trends in test scores, the greater the decline in scores over time.</p>
    <p><i>Colorblind users: We have made efforts to ensure accessibility for the most common forms of colorblindness. For less common forms (such as tritanopia), colors may be less distinguishable; however, the data are still accessible in the map legend, charts, and other displays.</i></p>
  `,
  HELP_HOW_Q4_A: `You can view data for counties, school districts, and public schools. To change between location types, use the <strong>“Showing …”</strong> menu in the top left of the header.`,
  HELP_HOW_Q5_A: `
    <p>You can navigate to your desired location via the navigation controls in the map. Or type a location name into the search bar in the upper right corner of the map and chart.</p>
    <p>Hovering (or on a touch device, tapping) on a location in the map or chart will show an overview of that location’s data. Clicking or tapping on the location will open a <strong>Location Panel</strong> that shows a full view of all available data, as well as options for viewing other selected locations. You can also export a <strong>PDF report</strong> from this panel.</p>
    <p>Clicking or tapping on locations will also add them as tabs in the bottom of the screen. (You can add up to six locations.) Click or tap on any location’s tab to highlight it in the map or chart, and the Location Panel.</p>
  `,
  HELP_HOW_Q6_A: `You can display a set of up to six location tabs at once. Each additional selection will remove a selection from the beginning of the set.`,
  HELP_HOW_Q7_A: `Clicking or tapping on any location will open a <strong>Location Panel</strong> that offers a full view of the data.`,
  HELP_HOW_Q8_A: `
    <p>In two ways. First, you can select up to six locations and view all their data together in the “Comparison” tab of the <strong>Location Panel</strong> (which opens when you click on a place in the map or on the chart).</p>
    <p>Below your selected locations in the Comparison tab, you can choose <strong>Show Similar Places</strong> to display additional locations that are similar to the most-recently-selected-place.</p>
  `,
  HELP_HOW_Q9_A: `
    <p>For each Key Measure (such as average test scores), we offer data on the gaps between certain demographic groups, such as White / Black, Male / Female, and Poor / Non-Poor.</p>
    <p>You can view these gaps in the map and chart by selecting groups for comparison in the <strong>“Showing …”</strong> menu in the header, or in the <strong>Location Panel</strong> that opens when clicking / tapping on a location.</p>
    <p>In Map View, the size of the gap is shown as colors on the map.</p>
    <p>In Chart View, the demographic groups are charted on the horizontal and vertical axes, and the distance from the diagonal line in the chart shows the size of the gap.</p>
    <p>While in Chart View, you can also select <strong>Show Gap vs. Other Metrics</strong> to view a second chart. Here, the size of the gap is plotted on the vertical axis. The gap between groups on another measure (such as socioeconomic status) is shown on the horizontal axis.</p>
  `,
  HELP_HOW_Q10_A: `
    <p>Click on any location in the map or charts, and a <strong>Location Panel</strong> will appear containing data about that place. Scroll to the bottom of this panel and click <strong>Export a Report</strong>, then <strong>Download Report</strong>.</p>
    <p>You can generate a PDF report for any location, which contains charts, figures, and other information about the currently-selected county, district, or school.</p>
  `,
  HELP_HOW_Q11_A: `
    To learn more about the concepts presented here and how to use this Explorer tool, please see our <a href="/help-faq/" target="_blank">FAQ</a>. To learn more about educational opportunity in America, please see our <a href="/discoveries/" target="_blank">Discoveries</a> articles, which explore and visualize different facets of educational opportunity. You can also see a list of <a href="/news/" target="_blank">news</a> articles about this data, view our <a href="/research/" target="_blank">research papers</a>, and learn about our <a href="/methods/" target="_blank">methods</a> for compiling and validating the data.
  `,
  HELP_HOW_Q12_A: `
  Please see our <a href="/get-the-data/" target="_blank">Get the Data</a> page to gain access to the full dataset.
  `,

  EMBED_MAP_TITLE: '$[concept] in U.S. $[region]',
  EMBED_MAP_SUBTITLE:
    'shown by $[metric] for $[demographic] in grades 3 - 8 from 2009 - 2016',
  EMBED_DIALOG_TITLE: 'Embed a Map or Chart',
  EMBED_MAP_INSTRUCTIONS:
    'Use the code below to embed the map on your website.  The map will match your current map view and selections in the explorer. ',
  EMBED_MAP_PREVIEW: 'View Map Preview',
  EMBED_MAP_INPUT_LABEL: 'Map Embed Code',
  EMBED_CHART_INSTRUCTIONS:
    'Use the code below to embed the chart on your website.  The chart will match your current data selections. ',
  EMBED_CHART_PREVIEW: 'View Chart Preview',
  EMBED_CHART_INPUT_LABEL: 'Chart Embed Code',
  EMBED_SECONDARY_INSTRUCTIONS:
    'The current gap view has two charts, use the code below to embed the secondary chart on your website.',
  EMBED_COPY_LABEL: 'Copy embed code',

  LINK_DIALOG_TITLE: 'Share a Link',
  LINK_INSTRUCTIONS:
    'Copy the link below to share the current view of the explorer.',
  LINK_INPUT_LABEL: 'Current View URL',
  LINK_COPY_LABEL: 'copy link'
}

export default LANG
