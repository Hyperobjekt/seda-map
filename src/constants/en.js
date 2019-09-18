const LANG = {

  'NO_DATA': 'Unavailable',

  // Header
  'LOGO_ALT_TEXT': 'Educational Opportunity Project',
  'TAB_CONCEPT_AVG': 'Average Test Scores',
  'TAB_METRIC_AVG': 'reflect educational opportunity',
  'TAB_CONCEPT_GRD': 'Learning Rates',
  'TAB_METRIC_GRD': 'reflect school effectiveness',
  'TAB_CONCEPT_COH': 'Trends in Test Scores',
  'TAB_METRIC_COH': 'reflect educational opportunity changes',

  // Mobile header
  'MOBILE_SUBLINE': 'for $[demographic] in $[place] $[region]',
  
  // Menu
  'MENU_HOME': 'Home',
  'MENU_OPPORTUNITY': 'Opportunity Explorer',
  'MENU_DISCOVERIES': 'Discoveries',
  'MENU_ABOUT': 'About',
  'MENU_FAQ': 'FAQ',
  'MENU_METHODS': 'Methods',
  'MENU_RESEARCH': 'Research',
  'MENU_NEWS': 'In The News',
  'MENU_DATA': 'Get The data',
  'MENU_FACEBOOK': 'Educational Opportunity Project on Facebook',
  'MENU_TWITTER': 'Educational Opportunity Project on Twitter',
  'MENU_LINKEDIN': 'Educational Opportunity Project on LinkedIn',
  'MENU_YOUTUBE': 'Educational Opportunity Project on YouTube',

  'SHARE_TWITTER': 'Explore educational opportunity in your community and around the country',

  // Footer
  'FOOTER_COPYRIGHT': 'Copyright 2019',
  'FOOTER_SHARE_LABEL': 'Share:',
  'FOOTER_SHARE_FACEBOOK': 'Share on Facebook',
  'FOOTER_SHARE_TWITTER': 'Share on Twitter',
  'FOOTER_SHARE_LINK': 'Share Link',
  'FOOTER_EMBED_LINK': 'Embed the map or chart',
  'FOOTER_EXPORT_LABEL': 'Export:',
  'FOOTER_EXPORT_PDF': 'PDF',
  'FOOTER_EXPORT_PPT': 'Powerpoint',

  'DATA_UNAVAILABLE': 'No data available',

  // UI Labels
  'HELP_BUTTON': 'Help',
  'UI_MAP_BUTTON': 'Map',
  'UI_CHART_BUTTON': 'Chart',
  'UI_SPLIT_BUTTON': 'Chart + map',
  'UI_REPORT_LOADING': 'Generating PDF report. Please be patient—this may take up to 30 seconds...',

  // Screen Reader Labels
  'UI_MAP_BUTTON_SR': 'Go to map view',
  'UI_CHART_BUTTON_SR': 'Go to chart view',
  'UI_SPLIT_BUTTON_SR': 'Go to chart and map split view',
  'UI_MAP_SR': 'Map of $[region] in the United States, with colors showing $[metric] for $[demographic].',
  'UI_CHART_SR': 'Scatterplot with dots representing $[region] in the United States.  $[region] are positioned vertically on the Y axis based on $[yVar] and horizontally on the X axis based on $[xVar].',
  'UI_LEGEND_BAR_SR': 'A legend bar for $[title] showing $[lowValue] on the low end, $[midValue] in the middle, and $[highValue] on the high end.',
  'UI_BRANDING_SR': 'Brought to you by Stanford University',

  // Metric Labels
  'LABEL_AVG': 'average test scores',
  'LABEL_AVG_W': 'White students\' average test scores',
  'LABEL_AVG_B': 'Black students\' average test scores',
  'LABEL_AVG_A': 'Asian students\' average test scores',
  'LABEL_AVG_H': 'Hispanic students\' average test scores',
  'LABEL_AVG_P': 'Poor students\' average test scores',
  'LABEL_AVG_NP': 'Non-poor students\' average test scores',
  'LABEL_AVG_M': 'Male students\' average test scores',
  'LABEL_AVG_F': 'Female students\' average test scores',
  'LABEL_AVG_WB': 'White / Black Gap in Test Scores',
  'LABEL_AVG_WH': 'White / Hispanic Gap in Test Scores',
  'LABEL_AVG_PN': 'Poor / Non-Poor Gap in Test Scores',
  'LABEL_AVG_MF': 'Male / Female Gap in Test Scores',
  'LABEL_GRD': 'learning rates',
  'LABEL_GRD_W': 'White students\' learning rates',
  'LABEL_GRD_B': 'Black students\' learning rates',
  'LABEL_GRD_A': 'Asian students\' learning rates',
  'LABEL_GRD_H': 'Hispanic students\' learning rates',
  'LABEL_GRD_P': 'Poor students\' learning rates',
  'LABEL_GRD_NP': 'Non-poor students\' learning rates',
  'LABEL_GRD_M': 'Male students\' learning rates',
  'LABEL_GRD_F': 'Female students\' learning rates',
  'LABEL_GRD_WB': 'White / Black Gap in Learning Rates',
  'LABEL_GRD_WH': 'White / Hispanic Gap in Learning Rates',
  'LABEL_GRD_PN': 'Poor / Non-Poor Gap in Learning Rates',
  'LABEL_GRD_MF': 'Male / Female Gap in Learning Rates',
  'LABEL_COH': 'trend in test scores',
  'LABEL_COH_W': 'White students\' trend in test scores',
  'LABEL_COH_H': 'Hispanic students\' trend in test scores',
  'LABEL_COH_B': 'Black students\' trend in test scores',
  'LABEL_COH_A': 'Asian students\' trend in test scores',
  'LABEL_COH_P': 'Poor students\' trend in test scores',
  'LABEL_COH_NP': 'Non-poor students\' trend in test scores',
  'LABEL_COH_M': 'Male students\' trend in test scores',
  'LABEL_COH_F': 'Female students\' trend in test scores',
  'LABEL_COH_WB': 'White / Black Gap in Test Score Trends',
  'LABEL_COH_WH': 'White / Hispanic Gap in Test Score Trends',
  'LABEL_COH_PN': 'Poor / Non-Poor Gap in Test Score Trends',
  'LABEL_COH_MF': 'Male / Female Gap in Test Score Trends',
  'LABEL_SEG': 'school poverty',
  'LABEL_SEG_NP': 'poor - non-poor gap in school poverty',
  'LABEL_SEG_WB': 'Black - White gap in school poverty',
  'LABEL_SEG_WH': 'Hispanic - White gap in school poverty',
  'LABEL_SES_NO_REGION' : 'socioeconomic status (SES)',
  'LABEL_SES': '$[region] socioeconomic status (SES)',
  'LABEL_SES_W': 'White families\' socioeconomic status (SES)',
  'LABEL_SES_B': 'Black families\' socioeconomic status (SES)',
  'LABEL_SES_A': 'Asian families\' socioeconomic status (SES)',
  'LABEL_SES_H': 'Hispanic families\' socioeconomic status (SES)',
  'LABEL_SES_M': '$[region] socioeconomic status (SES)',
  'LABEL_SES_F': '$[region] socioeconomic status (SES)',
  'LABEL_SES_P': '$[region] socioeconomic status (SES)',
  'LABEL_SES_NP': '$[region] socioeconomic status (SES)',
  'LABEL_SES_WB': 'White - Black gap in socioeconomic status',
  'LABEL_SES_WH': 'White - Hispanic gap in socioeconomic status',
  'LABEL_FRL': 'Free/Reduced Price Lunch Percentage',

  // Short Metric Labels
  'LABEL_SHORT_AVG': 'scores',
  'LABEL_SHORT_GRD': 'rate',
  'LABEL_SHORT_COH': 'trend',
  'LABEL_SHORT_SES': 'SES',
  'LABEL_SHORT_FRL': 'Free Lunch',
  'LABEL_SHORT_SEG': 'Poverty',

  'LABEL_SHORT_AVG_GAP': 'scores',
  'LABEL_SHORT_GRD_GAP': 'rate',
  'LABEL_SHORT_COH_GAP': 'trend',
  'LABEL_SHORT_SEG_GAP': 'Poverty',
  'LABEL_SHORT_SES_GAP': 'SES',

  // Concepts that correspond to metric
  'LABEL_CONCEPT_AVG': 'educational opportunity',
  'LABEL_CONCEPT_GRD': 'school effectiveness',
  'LABEL_CONCEPT_COH': 'educational opportunity change',

  // Demographic Labels
  'LABEL_ALL': 'all',
  'LABEL_B': 'Black',
  'LABEL_W': 'White',
  'LABEL_H': 'Hispanic',
  'LABEL_A': 'Asian',
  'LABEL_M': 'male',
  'LABEL_F': 'female',
  'LABEL_P': 'poor',
  'LABEL_NP': 'non-poor',
  'LABEL_N': 'non-poor',

  // Gap Labels
  'LABEL_WB': 'White / Black gap',
  'LABEL_WH': 'White / Hispanic gap',
  'LABEL_PN': 'non-poor / poor gap',
  'LABEL_MF': 'male / female gap',
  'LABEL_GAP': '$[demographic1] and $[demographic2]',

  // Abbreviated Gap Labels
  'LABEL_SHORT_BW': 'White / Black',
  'LABEL_SHORT_HW': 'White / Hispanic',
  'LABEL_SHORT_PN': 'poor / non-poor',
  'LABEL_SHORT_FM': 'male / female',
  'LABEL_SHORT_WB': 'White / Black',
  'LABEL_SHORT_WH': 'White / Hispanic',
  'LABEL_SHORT_MF': 'male / female',

  // Demographic label for students
  'LABEL_STUDENTS_ALL': 'Students',
  'LABEL_STUDENTS_B': 'Black students',
  'LABEL_STUDENTS_W': 'White students',
  'LABEL_STUDENTS_H': 'Hispanic students',
  'LABEL_STUDENTS_A': 'Asian students',
  'LABEL_STUDENTS_M': 'Male students',
  'LABEL_STUDENTS_F': 'Female students',
  'LABEL_STUDENTS_P': 'Poor students',
  'LABEL_STUDENTS_NP': 'Non-poor students',
  'LABEL_STUDENTS_N': 'Non-poor students',
  'LABEL_STUDENTS_WB': 'difference between White and Black students',
  'LABEL_STUDENTS_WH': 'difference between White and Hispanic students',
  'LABEL_STUDENTS_MF': 'difference between male and female students',
  'LABEL_STUDENTS_PN': 'difference between non-poor and poor students',

  // Region Labels
  'LABEL_COUNTIES': 'counties',
  'LABEL_DISTRICTS': 'school districts',
  'LABEL_SCHOOLS': 'schools',
  'LABEL_COUNTIES_SINGULAR': 'county',
  'LABEL_DISTRICTS_SINGULAR': 'school district',
  'LABEL_SCHOOLS_SINGULAR': 'school',

  'LABEL_BY_SUBGROUP': '$[metric] by subgroup',
  'LABEL_DEMOGRAPHIC': 'Demographic or gap',
  'LABEL_REGION': 'Region',
  'LABEL_HIGHLIGHTED_STATE': 'Highlighted State',

  'LABEL_GAP_INPUT': '$[dem1] - $[dem2] gap in',

  // Tooltips
  'TOOLTIP_SUMMARY': 'Click on a location for more.',
  'TOOLTIP_TYPE_MAP': 'an area on the map',
  'TOOLTIP_TYPE_CHART': 'an area on the chart',
  'TOOLTIP_CONTEXT_ALL': 'Data for all students:',
  'TOOLTIP_CONTEXT_W': 'Data for White students:',
  'TOOLTIP_CONTEXT_B': 'Data for Black students:',
  'TOOLTIP_CONTEXT_H': 'Data for Hispanic students:',
  'TOOLTIP_CONTEXT_A': 'Data for Asian students:',
  'TOOLTIP_CONTEXT_M': 'Data for male students:',
  'TOOLTIP_CONTEXT_F': 'Data for female students:',
  'TOOLTIP_CONTEXT_P': 'Data for poor students:',
  'TOOLTIP_CONTEXT_NP': 'Data for non-poor students:',
  'TOOLTIP_CONTEXT_WB': 'White / Black gap in:',
  'TOOLTIP_CONTEXT_WH': 'White / Hispanic gap in:',
  'TOOLTIP_CONTEXT_PN': 'Poor / non-poor gap in:',
  'TOOLTIP_CONTEXT_MF': 'Male / Female gap in:',
  'TOOLTIP_CONTEXT_AVG': 'Average test scores for:',
  'TOOLTIP_CONTEXT_GRD': 'Learning rates for:',
  'TOOLTIP_CONTEXT_COH': 'Trend in test scores for:',

  // Location Panel Headings
  'PANEL_HEADING': '$[metric] for $[region]',

  // Location panel flags
  'FLAG_SPED': 'This school serves primarily special education students; keep in mind when interpreting test scores. See <a href="#">FAQ</a> for information.',
  'FLAG_LEP': 'This school serves primarily students with limited English proficiency (LEP); keep in mind when interpreting test scores. See <a href="#">FAQ</a> for information.',
  'FLAG_GIFTED': 'This school has a high percentage of gifted students; keep in mind when interpreting test scores. See <a href="#">FAQ</a> for information.',

  // Location Panel Summaries (Counties / Districts)
  'SUMMARY_AVG_LOW': '$[name] provides <strong>lower than average</strong> educational opportunites.',
  'SUMMARY_AVG_MID': '$[name] provides <strong>roughly average</strong> educational opportunites.',
  'SUMMARY_AVG_HIGH': '$[name] provides <strong>higher than average</strong> educational opportunites.',
  
  'SUMMARY_AVGSES_LOW': 'Average scores are $[value] grade levels lower than $[region] with similar socioeconomic status.',
  'SUMMARY_AVGSES_MID': 'Average scores are equal to $[region] with similar socioeconomic status.',
  'SUMMARY_AVGSES_HIGH': 'Average scores are $[value] grade levels higher than $[region] with similar socioeconomic status.',
  'SUMMARY_AVGSES_NONE': ' ',
  
  'SUMMARY_GRD_LOW': '$[name] provides lower than average educational opportunities while children are in school.',
  'SUMMARY_GRD_MID': '$[name] provides roughly average educational opportunities while children are in school.',
  'SUMMARY_GRD_HIGH': '$[name] provides higher than average educational opportunities while children are in school.',
  
  'SUMMARY_GRDSES_LOW': 'Learning rates are $[value] lower than $[region] with similar socioeconomic status.',
  'SUMMARY_GRDSES_MID': 'Learning rates are equal to $[region] with similar socioeconomic status.',
  'SUMMARY_GRDSES_HIGH': 'Learning rates are $[value] higher than $[region] with similar socioeconomic status.',
  'SUMMARY_GRDSES_NONE': ' ',

  'SUMMARY_COH_LOW': '$[name] shows declining educational opportunity.',
  'SUMMARY_COH_MID': '$[name] shows relatively stable educational opportunity.',
  'SUMMARY_COH_HIGH': '$[name] shows improving educational opportunity.',

  'SUMMARY_COHSES_LOW': 'Average scores have declined by $[value] grade levels less than $[region] with similar socioeconomic status.',
  'SUMMARY_COHSES_MID': 'Trends in test scores are similar to $[region] with similar socioeconomic status.',
  'SUMMARY_COHSES_HIGH': 'Average scores have improved by $[value] grade levels more than $[region] with similar socioeconomic status.',
  'SUMMARY_COHSES_NONE': ' ',

  // Location Panel Summaries (Schools)
  'SUMMARY_SCHOOL_AVG_LOW': 'The children attending $[name] have <strong>lower than average</strong> educational opportunites.',
  'SUMMARY_SCHOOL_AVG_MID': 'The children attending $[name] have <strong>roughly average</strong> educational opportunites.',
  'SUMMARY_SCHOOL_AVG_HIGH': 'The children attending $[name] have <strong>higher than average</strong> educational opportunites.',
  
  'SUMMARY_AVGFRL_LOW': 'Average scores are $[value] grade levels lower than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_AVGFRL_MID': 'Average scores are equal to $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_AVGFRL_HIGH': 'Average scores are $[value] grade levels higher than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_AVGFRL_NONE': ' ',

  'SUMMARY_SCHOOL_GRD_LOW': '$[name] provides lower than average educational opportunities while children are in school.',
  'SUMMARY_SCHOOL_GRD_MID': '$[name] provides roughly average educational opportunities while children are in school.',
  'SUMMARY_SCHOOL_GRD_HIGH': '$[name] provides higher than average educational opportunities while children are in school.',
  
  'SUMMARY_GRDFRL_LOW': 'Learning rates are $[value] lower than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_GRDFRL_MID': 'Learning rates are equal to $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_GRDFRL_HIGH': 'Learning rates are $[value] higher than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_GRDFRL_NONE': ' ',

  'SUMMARY_SCHOOL_COH_LOW': 'Educational opportunities for the children attending $[name] declined in the years 2009-2016.',
  'SUMMARY_SCHOOL_COH_MID': 'Educational opportunities for the children attending $[name] were roughly stable in the years 2009-2016',
  'SUMMARY_SCHOOL_COH_HIGH': 'Educational opportunities for the children attending $[name] improved in the years 2009-2016.',

  'SUMMARY_COHFRL_LOW': 'Average scores have declined by $[value] grade levels less than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_COHFRL_MID': 'Trends in test scores are similar to $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_COHFRL_HIGH': 'Average scores have improved by $[value] grade levels more than $[region] with similar free/reduced-price lunch percentage.',
  'SUMMARY_COHFRL_NONE': ' ',

  'SUMMARY_AVG_NONE': 'No community educational opportunity data for $[name].', 
  'SUMMARY_GRD_NONE': 'No school-based opportunity data for $[name].', 
  'SUMMARY_COH_NONE': 'No change in community educational opportunity data for $[name].', 
  'SUMMARY_SES_NONE': '',
  'SUMMARY_FRL_NONE': '',

  'CALLOUT_AVG_OPP': 'How do average test scores show educational opportunity?',
  'CALLOUT_AVG_SES': 'How does socioeconomic status impact educational opportunity?',
  'CALLOUT_GRD': 'How do learning rates show school effectiveness?',
  'CALLOUT_COH': 'How does the average trend in test scores show changes in educational opportunity?',

  'BUTTON_GAP_WB': 'Explore the White / Black Gap',
  'BUTTON_GAP_WH': 'Explore the White / Hispanic Gap',
  'BUTTON_GAP_PN': 'Explore the Poor / Non-poor Gap',
  'BUTTON_GAP_MF': 'Explore the male / female Gap',
  'BUTTON_DOWNLOAD_REPORT': 'Download Report',

  'LOCATION_COMPARE_FEATURES_TITLE': '$[region] Comparison',
  'LOCATION_COMPARE_FEATURES_NONE': 'Select another place from the map, chart, or search to compare it with $[name].',
  'LOCATION_COMPARE_FEATURES': 'Below are your previous location selections.  The arrows mark where $[name] falls on the scale.',
  'LOCATION_EXPORT_REPORT_TITLE': 'Export a Report',
  'LOCATION_EXPORT_REPORT': `Press the button below to generate a PDF report about educational opportunity in $[name].`,
  'LOCATION_DIFFERENCES_TITLE': 'Opportunity Differences',
  'LOCATION_DIFFERENCES': '',
  'LOCATION_SIMILAR_PLACES_TITLE': 'Similar $[region]',
  'LOCATION_SIMILAR_PLACES': `The following places are similar to $[name] based on size, socioeconomic status, and other factors:`,
  'LOCATION_SIMILAR_PLACES_SUMMARY': 'Find places similar to $[name] based on size, socioeconomic status:',
  'LOCATION_SIMILAR_SHOW': 'Show similar places',
  'LOCATION_SHOW_PLACE': 'Show data for $[name]',

  'LOCATION_SHOW_AVG': 'more details on average test scores',
  'LOCATION_SHOW_GRD': 'more details on learning rates',
  'LOCATION_SHOW_COH': 'more details on test score trends',
  'LOCATION_HIDE_AVG': 'hide details on average test scores',
  'LOCATION_HIDE_GRD': 'hide details on learning rates',
  'LOCATION_HIDE_COH': 'hide details on test score trends',

  // Description of metric value for location
  'VALUE_AVG_HIGH': '$[students] score <strong>$[value] grade levels above</strong> U.S. average.',
  'VALUE_AVG_MID': '$[students] test scores are at the national average.',
  'VALUE_AVG_LOW': '$[students] score <strong>$[value] grade levels below</strong> U.S. average.',
  'VALUE_GRD_HIGH': '$[students] learn <strong>$[value] more each grade</strong> than the U.S. average.',
  'VALUE_GRD_MID': '$[students] learn the same each grade as the U.S. average.',
  'VALUE_GRD_LOW': '$[students] learn <strong>$[value] less each grade</strong> than the U.S. average.',
  'VALUE_COH_HIGH': '$[students] test scores <strong>increased an average of $[value] grade levels</strong> each year from 2009-2016.',
  'VALUE_COH_MID': '$[students] test scores were stable from 2009-2016.',
  'VALUE_COH_LOW': '$[students] test scores <strong>decreased an average of $[value] grade levels</strong> each year from 2009-2016.',

  'VALUE_SES_ULTRA_HIGH': 'Socioeconomic status is <strong>very far above national average</strong>.',
  'VALUE_SES_VERY_HIGH': 'Socioeconomic status is <strong>far above national average</strong>.',
  'VALUE_SES_HIGH': 'Socioeconomic status is <strong>above national average</strong>.',
  'VALUE_SES_MID': 'Socioeconomic status is <strong>about average</strong>.',
  'VALUE_SES_LOW': 'Socioeconomic status is <strong>below national average</strong>.',
  'VALUE_SES_VERY_LOW': 'Socioeconomic status is <strong>far below national average</strong>.',
  'VALUE_SES_ULTRA_LOW': 'Socioeconomic status is <strong>very far below national average</strong>.',

  'VALUE_FRL': '<strong>$[value] of students</strong> qualify for free or reduced lunch program.',

  'VALUE_SEG': '<strong>$[value] school poverty</strong>',

  // Description of gap value for location
  'VALUE_AVG_GAP': '$[demographic1] and $[demographic2] students’ average scores differ by $[value] grade levels.',
  'VALUE_GRD_GAP': '$[demographic1] and $[demographic2] students’ learning rates differ by $[value] per year.',
  'VALUE_COH_GAP': '$[demographic1] and $[demographic2] students’ learning rates differ by $[value] grade levels per year.',
  'VALUE_SES_GAP': '$[demographic1] students’ average socioeconomic status is $[difference] $[demographic2] students’.',
  'VALUE_SEG_GAP': 'Poverty rate in $[demographic2] students’ schools are $[value] $[highLow] than $[demographic1] students’ schools.',

  'DIFF_VERY_HIGH': 'much higher than',
  'DIFF_HIGH': 'higher than',
  'DIFF_MID': 'roughly equal to',
  'DIFF_LOW': 'lower than',
  'DIFF_VERY_LOW': 'much lower than',

  // Scatterplot Titles
  'SP_TITLE_AVG_SES': 'Educational Opportunity vs. Socioeconomic Status',
  'SP_TITLE_AVG_FRL': 'Educational Opportunity vs. % Free or Reduced Lunch Program ',
  'SP_TITLE_GRD_SES': 'School Effectiveness vs. Socioeconomic Status',
  'SP_TITLE_GRD_FRL': 'School Effectiveness vs. % Free or Reduced Lunch Program',
  'SP_TITLE_COH_SES': 'Changes in Educational Opportunity and Socioeconomic Status',
  'SP_TITLE_COH_FRL': 'Changes in Educational Opportunity and % Free or Reduced Lunch Program',
  'SP_TITLE_AVG_SES_GAP': 'Differences in Educational Opportunity vs. Socioeconomic Status',
  'SP_TITLE_GRD_SES_GAP': 'Differences in School Effectiveness vs. Socioeconomic Status',
  'SP_TITLE_COH_SES_GAP': 'Differences in Educational Opportunity Change and Socioeconomic Status',

  'SP_TITLE': '$[metric] vs. $[secondary]',
  'SP_TITLE_GAP': 'Difference in $[metric] vs. $[secondary]',
  'SP_TITLE_VS': 'Differences in $[metric]',
  'SP_SUBTITLE': '$[place] $[region], $[demographic], grades 3 - 8 from 2009 - 2016, sized by number of students',

  'OP_TITLE_AVG': 'Achievement Differences Between $[dem1] and $[dem2]',
  'OP_TITLE_GRD': 'Growth Differences Between $[dem1] and $[dem2]',
  'OP_TITLE_COH': 'Change in Achievement Differences Between $[dem1] and $[dem2]',

  // Axis Names
  'AXIS_NAME_FRL_PCT': '% of students qualifying for free or reduced lunch program',
  'AXIS_NAME_SES': '',

  // Axis Labels
  'AXIS_AVG_MID': 'national\naverage',
  'AXIS_AVG_LOW_SINGLE': '$[value] grade\nbelow',
  'AXIS_AVG_LOW': '$[value] grades\nbelow',
  'AXIS_AVG_HIGH_SINGLE': '$[value] grade\nabove',
  'AXIS_AVG_HIGH': '$[value] grades\nabove',

  'AXIS_GRD_MID_SINGLE': 'learned 1 grade\nlevel per year',
  'AXIS_GRD_LOW_SINGLE': 'learned\n$[value] less',
  'AXIS_GRD_LOW': 'learned\n$[value] less',
  'AXIS_GRD_HIGH_SINGLE': 'learned\n$[value] more',
  'AXIS_GRD_HIGH': 'learned\n$[value] more',

  'AXIS_COH_MID': 'no\nchange',
  'AXIS_COH_LOW_SINGLE': 'dropped $[value]\ngrade level',
  'AXIS_COH_LOW': 'declined $[value]\ngrade levels / year',
  'AXIS_COH_HIGH_SINGLE': 'improved $[value]\ngrade level / year',
  'AXIS_COH_HIGH': 'improved $[value]\ngrade levels / year',

  'AXIS_AVG_GAP_MID': 'no\ngap',
  'AXIS_AVG_GAP_LOW_SINGLE': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_LOW': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_HIGH_SINGLE': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_HIGH': '$[value] grade level\ndifference',

  'AXIS_GRD_GAP_MID': 'no\n difference',
  'AXIS_GRD_GAP_LOW': '-$[value] grade levels\nper year difference',
  'AXIS_GRD_GAP_HIGH': '$[value] grade levels\nper year difference',

  'AXIS_COH_GAP_MID': 'no\ndifference',
  'AXIS_COH_GAP_LOW': '-$[value] grade levels\nper year difference',
  'AXIS_COH_GAP_HIGH': '$[value] grade levels\nper year difference',

  'AXIS_SES_MID': 'national\naverage',
  'AXIS_SES_LOW': 'poorer',
  'AXIS_SES_HIGH': 'richer',

  'AXIS_SES_ZERO_GAP': 'no gap in\nsocioeconomic status',
  'AXIS_SES_LOW_GAP': '$[demographic1] richer',
  'AXIS_SES_HIGH_GAP': '$[demographic2] richer',
  'AXIS_SES_GAP_MID': 'no\ngap',

  'AXIS_SEG_MID': 'no\ngap',
  'AXIS_SEG_LOW': 'less',
  'AXIS_SEG_HIGH': 'more',

  'AXIS_SEG_GAP_MID': 'no gap',
  'AXIS_SEG_LOW_GAP': 'less',
  'AXIS_SEG_HIGH_GAP': 'more',

  'AXIS_FRL_MID': ' ',

  // PREVIEW CHART AXIS LABELS
  'AXIS_PREV_ZERO': 'avg',
  'AXIS_PREV_MID': 'avg',
  'AXIS_PREV_HIGH_SINGLE': 'avg',

  // LINE FOR VERSUS CHART
  'LINE_EQUAL_OPPORTUNITY': 'no gap ($[demographic1] = $[demographic2])',

  // BUTTON TO TOGGLE SECONDARY CHART
  'BUTTON_SHOW_CHART': 'Show gap vs. other metrics',
  'BUTTON_HIDE_CHART': 'Hide gap chart',

  'SEARCH_PLACEHOLDER': 'Find a city, county, district, or school',

  // Map Legend (Mobile)
  'LEGEND_LOW': '◀ lower',
  'LEGEND_HIGH': 'higher ▶',
  'LEGEND_LOW_AVG': '◀ below grade level',
  'LEGEND_HIGH_AVG': 'above grade level ▶',
  'LEGEND_LOW_GRD': '◀ learns less',
  'LEGEND_HIGH_GRD': 'learns more ▶',
  'LEGEND_LOW_COH': '◀ scores dropping',
  'LEGEND_HIGH_COH': 'scores improving ▶',
  'LEGEND_LOW_SES': '◀ poorer',
  'LEGEND_HIGH_SES': 'richer ▶',
  'LEGEND_LOW_FRL': '◀ more poverty',
  'LEGEND_HIGH_FRL': 'less poverty ▶',

  'LEGEND_SHORT_LOW_AVG': '◀ lower',
  'LEGEND_SHORT_HIGH_AVG': 'higher ▶',
  'LEGEND_SHORT_LOW_GRD': '◀ lower',
  'LEGEND_SHORT_HIGH_GRD': 'higher ▶',
  'LEGEND_SHORT_LOW_COH': '◀ lower',
  'LEGEND_SHORT_HIGH_COH': 'higher ▶',
  'LEGEND_SHORT_LOW_SES': '◀ poorer',
  'LEGEND_SHORT_HIGH_SES': 'richer ▶',
  'LEGEND_SHORT_LOW_FRL': '◀ high poverty',
  'LEGEND_SHORT_HIGH_FRL': 'low poverty ▶',

  // Text descriptions
  'LEGEND_DESC_AVG': 'Colors show how $[demographic] students score, in grade levels, relative to the national average.',
  'LEGEND_DESC_GRD': 'Colors show how much $[demographic] students learn each year relative to the national average.',
  //'LEGEND_DESC_COH': 'Colors show how many grade levels $[demographic] students\' test scores changed per year from 2009 - 2016.',
  'LEGEND_DESC_COH': 'Colors show how $[demographic] students\' average test scores changed (in grade levels per year) from 2009 - 2016.',
  'LEGEND_DESC_AVG_GAP': 'Colors show how many grade levels difference between $[gap] students.',
  'LEGEND_DESC_GRD_GAP': 'Colors show difference between how much $[gap] students learn each year.',
  'LEGEND_DESC_COH_GAP': 'Colors show difference between how much $[gap] students\' test scores changed each year.',

  // Average test score gaps
  'LEGEND_LOW_AVG_WB': ' ',
  'LEGEND_HIGH_AVG_WB': 'Larger gap (White students score higher) ▶',
  'LEGEND_LOW_AVG_WH': ' ',
  'LEGEND_HIGH_AVG_WH': 'Larger gap (White students score higher) ▶',
  'LEGEND_LOW_AVG_PN': ' ',
  'LEGEND_HIGH_AVG_PN': 'Larger gap (non-poor students score higher) ▶',
  'LEGEND_LOW_AVG_MF': ' ',
  'LEGEND_HIGH_AVG_MF': 'Larger gap (male students score higher) ▶',

  // Learning rate gaps
  'LEGEND_LOW_GRD_WB': ' ',
  'LEGEND_HIGH_GRD_WB': 'Larger gap (White students learn more) ▶',
  'LEGEND_LOW_GRD_WH': ' ',
  'LEGEND_HIGH_GRD_WH': 'Larger gap (White students learn more) ▶',
  'LEGEND_LOW_GRD_PN': ' ',
  'LEGEND_HIGH_GRD_PN': 'Larger gap (non-poor students learn more) ▶',
  'LEGEND_LOW_GRD_MF': ' ',
  'LEGEND_HIGH_GRD_MF': 'Larger gap (male students learn more) ▶',

  // Trend in scores gaps
  'LEGEND_LOW_COH_WB': ' ',
  'LEGEND_HIGH_COH_WB': 'Larger gap (White students\' scores improve more) ▶',
  'LEGEND_LOW_COH_WH': ' ',
  'LEGEND_HIGH_COH_WH': 'Larger gap (White students\' scores improve more) ▶',
  'LEGEND_LOW_COH_PN': ' ',
  'LEGEND_HIGH_COH_PN': 'Larger gap (non-poor students\' scores improve more) ▶',
  'LEGEND_LOW_COH_MF': ' ',
  'LEGEND_HIGH_COH_MF': 'Larger gap (male students\' scores improve more) ▶',

  // SES gaps
  'LEGEND_LOW_SES_WB': ' ',
  'LEGEND_HIGH_SES_WB': 'Larger SES gap, favoring White families ▶',
  'LEGEND_LOW_SES_WH': ' ',
  'LEGEND_HIGH_SES_WH': 'Larger SES gap, favoring White families ▶',

  // SEG gaps
  'LEGEND_LOW_SEG_WB': ' ',
  'LEGEND_HIGH_SEG_WB': 'Larger school poverty gap, favoring White families ▶',
  'LEGEND_LOW_SEG_WH': ' ',
  'LEGEND_HIGH_SEG_WH': 'Larger school poverty gap, favoring White families ▶',
  'LEGEND_LOW_SEG': ' ',
  'LEGEND_HIGH_SEG': 'Larger school poverty gap, favoring non-poor families ▶',

  // Map Legend
  'LEGEND_MAP_AVG_LOW': '$[value] grade levels',
  'LEGEND_MAP_AVG_MID': 'national average',
  'LEGEND_MAP_AVG_HIGH': '+$[value] grade levels',
  'LEGEND_MAP_AVG_GAP_LOW': '$[value] grade levels',
  'LEGEND_MAP_AVG_GAP_MID': 'no gap',
  'LEGEND_MAP_AVG_GAP_HIGH': '+$[value] grade levels',

  'LEGEND_MAP_GRD_LOW': 'learns $[value] less',
  'LEGEND_MAP_GRD_MID': 'national average',
  'LEGEND_MAP_GRD_HIGH': 'learns $[value] more',
  'LEGEND_MAP_GRD_GAP_LOW': '$[value] difference',
  'LEGEND_MAP_GRD_GAP_MID': 'no gap',
  'LEGEND_MAP_GRD_GAP_HIGH': '+$[value] difference',

  'LEGEND_MAP_COH_LOW': '$[value] grade levels',
  'LEGEND_MAP_COH_MID': 'no change',
  'LEGEND_MAP_COH_HIGH': '+$[value] grade levels',
  'LEGEND_MAP_COH_GAP_LOW': '$[value] grade levels',
  'LEGEND_MAP_COH_GAP_MID': 'no gap',
  'LEGEND_MAP_COH_GAP_HIGH': '+$[value] grade levels',

  'LEGEND_CHART_INTERACTIVE': 'Go to the expanded chart to explore interactively:',
  'LEGEND_CHART_BUTTON': 'Show Interactive Chart',

  'HELP_PANEL_TITLE': 'Help',
  'HELP_PANEL_HOW_TAB': 'How to explore',
  'HELP_PANEL_WHAT_TAB': 'What am I seeing',

  // What am I seeing labels
  'HP_MAP': 'map',
  'HP_CHART': 'chart',
  'HP_SPLIT': 'map and chart',
  'HP_SES' : 'socioeconomic status',

  'HELP_CURRENT': 'Current View',
  'HELP_OTHER': 'More Help',
  'HELP_HOW_TO': 'How to use the explorer',

  'HELP_LEGEND_LOW_AVG': 'lower',
  'HELP_LEGEND_HIGH_AVG': 'higher',
  'HELP_LEGEND_LOW_GRD': 'lower',
  'HELP_LEGEND_HIGH_GRD': 'higher',
  'HELP_LEGEND_LOW_COH': 'lower',
  'HELP_LEGEND_HIGH_COH': 'higher',

  'HELP_LEGEND_VAL_AVG_LOW': '$[students] score $[value] grade levels below average',
  'HELP_LEGEND_VAL_AVG_MID': 'national average',
  'HELP_LEGEND_VAL_AVG_HIGH': '$[students] score $[value] grade levels above average',

  'HELP_LEGEND_VAL_GRD_LOW': '$[students] learn $[value] less per grade than average',
  'HELP_LEGEND_VAL_GRD_MID': 'national average',
  'HELP_LEGEND_VAL_GRD_HIGH': '$[students] learn $[value] more per grade than average',

  'HELP_LEGEND_VAL_COH_LOW': '$[students] average test scores declining $[value] grade levels per year',
  'HELP_LEGEND_VAL_COH_MID': 'no change',
  'HELP_LEGEND_VAL_COH_HIGH': '$[students] average test scores improving $[value] grade levels per year',

  'HELP_LEGEND_VAL_AVG_GAP_LOW': 'Difference of $[value] grade levels in favor of $[students].',
  'HELP_LEGEND_VAL_AVG_GAP_MID': 'No difference',
  'HELP_LEGEND_VAL_AVG_GAP_HIGH': 'Difference of $[value] grade levels in favor of $[students].',

  'HELP_LEGEND_VAL_GRD_GAP_LOW': 'Difference of $[value] in learning rates in favor of $[students].',
  'HELP_LEGEND_VAL_GRD_GAP_MID': 'No difference',
  'HELP_LEGEND_VAL_GRD_GAP_HIGH': 'Difference of $[value] in learning rates in favor of $[students].',

  'HELP_LEGEND_VAL_COH_GAP_LOW': 'Difference of $[value] in trend of test scores in favor of $[students].',
  'HELP_LEGEND_VAL_COH_GAP_MID': 'No difference',
  'HELP_LEGEND_VAL_COH_GAP_HIGH': 'Difference of $[value] in trend of test scores in favor of $[students].',

  'HELP_MAP': 'What does the map show?',
  'HELP_MAP_DESC': 'This map of $[region] in $[state] shows $[metric] for $[demographic], on a scale $[metricDescription].',
  'HELP_MAP_DESC_GAP': 'This map of $[region] in $[state] shows the $[gap] in $[metric].', 
  'HELP_MAP_AVG_OVERVIEW': 'Average scores reflect more than just how well schools educate children; they reveal the full range of children’s educational opportunities, both in and out of school. (To better understand schools\' contributions, see Learning Rates.)',
  'HELP_MAP_GRD_OVERVIEW': 'Learning rates measure how much student scores improve each year while they are in school. This is a better way to assess what children learn in schools than average test scores, which are heavily influenced by factors outside of school.',
  'HELP_MAP_COH_OVERVIEW': 'Average student test scores are influenced by children’s home environments, early childhood experiences, community resources, and schools. The trend (or change) in average student test scores from one year to the next indicates whether educational opportunities are improving or declining in a community.',

  'HELP_CHART': 'What does the chart show?',
  'HELP_CHART_DOTS': 'Each circle represents a $[region]. The circle’s size shows the number of $[demographic] students.',
  'HELP_CHART_Y': 'This chart of $[region] in $[state] shows, on the vertical (Y) axis, $[metric] for $[demographic] on a scale $[metricDescription].',
  'HELP_CHART_X_SES': 'The horizontal (X) axis shows the $[region]’s Socioeconomic Status (SES), which is a broad measure of the economic and social resources available in a community.',
  'HELP_CHART_X_FRL': 'The horizontal (X) axis shows the percentage of students at the school who are eligible for the Federal Free & Reduced Price Lunch Program.',
  'HELP_CHART_PRIMARY': 'The primary chart shows a comparison of $[demographic1] and $[demographic2] students’ $[metric]. Each circle represents a $[region] in $[state]. The circle’s size shows the number of students. The vertical (Y) axis shows $[metricRange] for $[demographic2] students, on a scale $[metricDescription]. The horizontal (X) axis shows the same for $[demographic1] students.',
  'HELP_CHART_SECONDARY': 'The chart on the right shows the $[gap] in $[metric] on the vertical (Y) axis. The higher up the axis, the larger the gap. The horizontal (X) axis shows the gap in $[secondary] between these two groups. The farther to the right, the larger the gap favors $[demographic1] families. Each circle represents a $[region] in $[state]. The circle’s size shows the number of students.',

  'HELP_DATA_OVERVIEW': 'The test scores represented here were collected across grades 3-8 and the years 2009-2016 from the nation’s public elementary and middle schools.',

  'HELP_DESC_AVG': 'the range of Average Test Scores',
  'HELP_DESC_AVG_DETAILS': 'of grade levels above and below the national average',
  'HELP_DESC_GRD': 'the range of Learning Rates',
  'HELP_DESC_GRD_DETAILS': 'representing how much students learned in school relative to the national average',
  'HELP_DESC_COH': 'Trend in Test Scores',
  'HELP_DESC_COH_DETAILS': 'representing how much average test scores have improved or declined over time',

  'HELP_AVG_CONCEPT': 'Why do average test scores show educational opportunities in and out of school?',
  'HELP_GRD_CONCEPT': 'Why do average learning rates largely reflect schools effectiveness?',
  'HELP_COH_CONCEPT': 'How do trends in test scores show changes in a community’s educational opportunities?',
  
  'HELP_AVG': 'How are average test scores calculated?',
  'HELP_GRD': 'How are learning rates calculated?',
  'HELP_COH': 'How are trends in test scores calculated?',
  'HELP_SES': 'What is socioeconomic status and how is it calculated?',
  'HELP_SEG': 'What is the Gap in School Poverty and how is it calculated?',
  'HELP_FRL': 'How is the Free/Reduced-price Lunch Percentage calculated and what does it mean?',

  'HELP_AVG_CONCEPT_A': `Average student test scores are influenced by children’s opportunities to learn in their homes, in their neighborhoods, in the childcare, preschool, and after-school programs they attend, from their peers and friends, and in their schools. Because of all these influences, average test scores are not a good way to assess how much children learn in schools. But they are a good way to assess the average set of educational opportunities available to children in a community. Where average scores are low, students have fewer opportunities to learn. Schools are better evaluated using Learning Rates, which measure how much student scores improve while they are in school.`,
  'HELP_GRD_CONCEPT_A': `Learning rates measure how much student scores improve each year while they are in school. This is better way to assess what children learn in schools than average test scores, which are heavily influenced by factors outside of school. To understand the distinction, think of a hospital: We wouldn’t assess a hospital based on the health of its patients; rather, we’d judge it on how much its patients’ health improves as a result of their time in the hospital. Similarly, we shouldn’t evaluate a school based on the average scores of its students, but rather by how much their test scores improve while in school.`,
  'HELP_COH_CONCEPT_A': `Average student test scores are influenced by children’s home environments, early childhood experiences, community resources, and schools. The trend (or change) in average student test scores from one year to the next indicates whether educational opportunities are improving or declining in a community. Where the trend is positive, students’ opportunities to learn are improving. Opportunities may improve over time because of changes in school quality or because of changes in children’s family resources, home environments, early childhood experiences, and community resources.`,

  'HELP_AVG_A': `The average test score is based on the average of standardized math and English Language Arts (ELA) tests taken by public school students in grades 3 through 8 between 2009 and 2016. See the <a href="/help-faq/#how-measures-computed" target="_blank">FAQ</a> for more detail.`,
  'HELP_GRD_A': `The learning rate is based on changes in average test scores from each year and grade to the next year and grade (e.g., changes from 2015 3rd grade scores to 2016 4th grade scores). The learning rates are calculated using standardized math and English Language Arts (ELA) tests taken by public school students in grades 3 through 8 between 2009 and 2016. See the <a href='/help-faq/#how-measures-computed' target="_blank">FAQ</a> for more detail.`,
  'HELP_COH_A': `The trend in test scores is based on changes in average test scores from each year to the next in the same grade (e.g., changes from 2015 3rd grade scores to 2016 3rd grade scores). The test score trends are calculated using standardized math and English Language Arts (ELA) tests taken by public school students in grades 3 through 8 between 2009 and 2016. See the <a href='/help-faq/#how-measures-computed' target="_blank">FAQ</a> for more detail.`,
  'HELP_SES_A': `Socioeconomic status (SES) is a broad measure of the economic and social resources available in a community. It is based on information about the income, educational attainment, employment, and structure of all the families living in the community served by a school district or county. This information is combined into a single composite rating for each community. A rating of 0 represents the national average of socioeconomic status; higher ratings represent more affluent communities. See the <a href="/help-faq/#ses-measured" target="_blank">FAQ</a> for more detail. `,
  'HELP_SEG_A': `The gap in school poverty is a measure of school segregation. We use the proportion of students defined as “economically disadvantaged” in a school as a measure of school poverty. The black-white gap in school poverty, for example, measures the difference between the poverty rate of the average black student’s school and the poverty rate of the average white student’s school. When there is no segregation—when white and black students attend the same schools, or when white and black students’ schools have equal poverty rates—the black-white school poverty gap is 0. A positive black-white school poverty gap means that black students’ schools have higher poverty rates than white students’ schools, on average. A negative black-white school poverty gap means that white students’ schools have higher poverty rates than black students’ schools, on average.`,
  'HELP_FRL_A': `The free/reduced-price lunch percentage measures the proportion of students in the school who are eligible for free or reduced-price lunches through the National School Lunch Program. Students are eligible for free or reduced-price lunches if their family income is below 185% of the poverty threshold. A school with a free lunch rate of 0% has no poor or near-poor students; the higher the free lunch rate, the greater the number of poor students. The lower the free/reduced-price lunch percentage, the more affluent the school.`,

  'HELP_HOW_Q1': 'What are the different ways of exploring the data?',
  'HELP_HOW_Q2': 'What data can I choose from?',
  'HELP_HOW_Q3': 'What do the colors in the map and charts mean?',
  'HELP_HOW_Q4': 'What kinds of locations can I view?',
  'HELP_HOW_Q5': 'How can I find a location and view its data?',
  'HELP_HOW_Q6': 'How many locations can I select at once?',
  'HELP_HOW_Q7': 'How do I see all the data for a location at once?',
  'HELP_HOW_Q8': 'How do I view data on comparable locations?',
  'HELP_HOW_Q9': 'How can I see data on gaps between demographic groups?',
  'HELP_HOW_Q10': 'How do I export a report about my selected location?',
  'HELP_HOW_Q11': 'Where Can I Get More Help & Info About Educational Opportunity?',
  'HELP_HOW_Q12': 'How can I download the data?',

  'HELP_HOW_Q1_A':  `The Educational Opportunity Explorer offers 3 different ways of looking at Educational Opportunity in the U.S.: a map, a chart, and a “split screen” view of both. Use the <strong>Map | Chart | Map + Chart</strong> buttons in the tool to select one of these views.`,
  'HELP_HOW_Q2_A':  `<p>At the top of this Explorer, you can select from <strong>3 Key Measures</strong> of educational opportunity to display in the map and chart:</p>
    <ul>
      <li>Average Test Scores, which reflect educational opportunities in and out of school</li>
      <li>Learning rates, which reflect school effectiveness</li>
      <li>Trends In Test Scores, which reflect changes in educational opportunity</li>
    </ul>
    <p>Just below these buttons, you can use the <strong>“Showing …”</strong> drop-down menus to filter by demographic (e.g. “all students” or “female students”) or the gap between demographics (e.g. “male-female gap”), and the type of places (counties, school districts, or schools) you’d like to display. In the Chart view, you can also choose to view data for the entire country, or individual U.S. states.</p>
  `,
  'HELP_HOW_Q3_A':  `
    <p>Light gray represents the national average, or “no change” (for Trend in Test Scores).</p>
    <p>The deeper the green, the farther above the national average—or, for Trend in Test Scores, the greater the improvement in scores over time.</p>
    <p>The deeper the blue, the farther below the national average—or for Trend in Test Scores, the greater the decline in scores over time.</p>
    <p><i>Colorblind users: we have made efforts to ensure accessibility for the most common forms of colorblindness. For less common forms (such as Tritanopia), colors may be less distinguishable; however, the data is still accessible in the map legend, charts, and other displays.</i></p>
  `,
  'HELP_HOW_Q4_A':  `You can view data for counties, school districts, and public schools. To change between location types, use the <strong>“Showing …”</strong> menu in the top left of the header.`,
  'HELP_HOW_Q5_A':  `
    <p>You can navigate to your desired location (within any of the 50 U.S. states) via the navigation controls in the map. Or type a location name into the Search Bar in the upper right corner of the map and chart.</p>
    <p>Hovering (or on a touch device, tapping) on a location in the map or chart will show an overview of that location’s data. Clicking or tapping on the location will open a <strong>Location Panel</strong> that shows a full view of all available data, as well as options for viewing other selected locations. You can also export a <strong>PDF report</strong> from this panel.</p>
    <p>Clicking or tapping on locations will also add them as tabs in the bottom of the screen. (You can add up to 6 locations.) Click or tap on any location’s tab to highlight it in the map or chart, and the Location Panel.</p>
  `,
  'HELP_HOW_Q6_A':  `You can display a set of up to 6 location tabs at once. Each additional selection will remove a selection from the beginning of the set. `,
  'HELP_HOW_Q7_A':  `Clicking or tapping on any location will open a <strong>Location Panel</strong> that offers a full view of the available data.`,
  'HELP_HOW_Q8_A':  `
    <p>In two ways. First, you can select up to 6 locations and view all their data together in the “Comparison” tab of the <strong>Location Panel</strong> (which opens when you click on a place in the map or on the chart).</p>
    <p>Below your selected locations in the Comparison tab, you can choose <strong>Show Similar Places</strong> to display additional locations that are similar to the most recently-selected place.</p>
  `,
  'HELP_HOW_Q9_A':  `
    <p>For every Key Metric (such as Average Test Scores), we offer data on the gaps between certain demographic groups, such as White / Black, Male / Female, and Poor / Non-Poor.</p>
    <p>You can view these gaps in the map and chart by selecting groups for comparison in the <strong>“Showing …”</strong> menu in the header, or in the <strong>Location Panel</strong> that opens when clicking / tapping on a location.</p>
    <p>In Map View, the size of the gap is shown as colors on the map.</p>
    <p>In Chart View, the demographic groups are charted on the horizontal and vertical axes, and the distance from the diagonal line in the chart shows the size of the gap.</p>
    <p>While in Chart View, you can also select <strong>Show Gap vs. Other Metrics</strong> to view a second chart. Here, the size of the gap is plotted on the vertical axis. The gap between groups on another measure (such as socioeconomic status) is shown on the horizontal axis.</p>
  `,
  'HELP_HOW_Q10_A': `
    <p>Click on any location in the map or charts, and a <strong>Location Panel</strong> will appear containing data about that place. Scroll to the bottom of this panel and click <strong>Export a Report</strong>, then <strong>Download Report</strong>.</p>
    <p>You can generate a PDF report for any location, which contains charts, figures, and other information about the currently-selected county, district, or school.</p>
  `,
  'HELP_HOW_Q11_A': `
    To learn more about the concepts presented here and how to use this Explorer tool, please see our <a href="/help-faq/" target="_blank">FAQ</a>. To learn more about educational opportunity in America, please see our <a href="/discoveries/" target="_blank">Discoveries</a> articles, which explore and visualize different facets of educational opportunity. You can also see a list of <a href="/news/" target="_blank">news</a> articles about this data, view our <a href="/research/" target="_blank">research papers</a>, and learn about our <a href="/methods/" target="_blank">methods</a> for compiling and validating the data.
  `,
  'HELP_HOW_Q12_A': `
  Please see our <a href="/get-the-data/" target="_blank">Get the Data</a> page to gain access to the full dataset.
  `,

  'EMBED_MAP_TITLE': '$[concept] in U.S. $[region]',
  'EMBED_MAP_SUBTITLE': 'shown by $[metric] for $[demographic] in grades 3 - 8 from 2009 - 2016',
  'EMBED_DIALOG_TITLE': 'Embed a Map or Chart',
  'EMBED_MAP_INSTRUCTIONS': 'Use the code below to embed the map on your website.  The map will match your current map view and selections in the explorer. ',
  'EMBED_MAP_PREVIEW': 'View Map Preview',
  'EMBED_MAP_INPUT_LABEL': 'Map Embed Code',
  'EMBED_CHART_INSTRUCTIONS': 'Use the code below to embed the chart on your website.  The chart will match your current data selections. ',
  'EMBED_CHART_PREVIEW': 'View Chart Preview',
  'EMBED_CHART_INPUT_LABEL': 'Chart Embed Code',
  'EMBED_SECONDARY_INSTRUCTIONS': 'The current gap view has two charts, use the code below to embed the secondary chart on your website.',
  'EMBED_COPY_LABEL': 'Copy embed code',

  'LINK_DIALOG_TITLE': 'Share a Link',
  'LINK_INSTRUCTIONS': 'Copy the link below to share the current view of the explorer.',
  'LINK_INPUT_LABEL': 'Current View URL',
  'LINK_COPY_LABEL': 'copy link',
}

export default LANG