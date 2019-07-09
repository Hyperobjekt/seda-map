const LANG = {

  'NO_DATA': 'Unavailable',

  // Header
  'LOGO_ALT_TEXT': 'Educational Opportunity Project',
  'TAB_CONCEPT_AVG': 'Average Test Scores',
  'TAB_METRIC_AVG': 'show community educational opportunity',
  'TAB_CONCEPT_GRD': 'Growth of Test Scores Per Year',
  'TAB_METRIC_GRD': 'show school-based opportunity',
  'TAB_CONCEPT_COH': 'Changes in Test Scores Over Time',
  'TAB_METRIC_COH': 'show changes in educational opportunity',

  // Menu
  'MENU_HOME': 'Home',
  'MENU_OPPORTUNITY': 'Opportunity Explorer',
  'MENU_DISCOVERIES': 'Discoveries',
  'MENU_ABOUT': 'About',
  'MENU_FAQ': 'FAQ',
  'MENU_METHODS': 'Methods',
  'MENU_RESEARCH': 'Research',
  'MENU_NEWS': 'In The News',
  'MENU_FACEBOOK': 'Educational Opportunity Project on Facebook',
  'MENU_TWITTER': 'Educational Opportunity Project on Twitter',
  'MENU_LINKEDIN': 'Educational Opportunity Project on LinkedIn',
  'MENU_YOUTUBE': 'Educational Opportunity Project on YouTube',

  // Footer
  'FOOTER_COPYRIGHT': 'Copyright 2019',
  'FOOTER_SHARE_LABEL': 'Share:',
  'FOOTER_SHARE_FACEBOOK': 'Share on Facebook',
  'FOOTER_SHARE_TWITTER': 'Share on Twitter',
  'FOOTER_SHARE_LINK': 'Share Link',
  'FOOTER_EXPORT_LABEL': 'Export:',
  'FOOTER_EXPORT_PDF': 'PDF',
  'FOOTER_EXPORT_PPT': 'Powerpoint',

  'DATA_UNAVAILABLE': 'No data available',

  // Help
  'HELP_SCREEN_READER': 'Help',

  // Metric Labels
  'LABEL_AVG': 'average test scores',
  'LABEL_GRD': 'growth in test scores',
  'LABEL_COH': 'changes in test scores',
  'LABEL_SEG': 'Segregation Measure',
  'LABEL_SES': 'socioeconomic status',
  'LABEL_PCT': 'Percent',

  'LABEL_SHORT_AVG': 'AVG:',
  'LABEL_SHORT_GRD': 'Growth:',
  'LABEL_SHORT_COH': 'Change:',
  'LABEL_SHORT_SES': 'SES:',

  'LABEL_CONCEPT_AVG': 'community educational opportunity',
  'LABEL_CONCEPT_GRD': 'school-based educational opportunity',
  'LABEL_CONCEPT_COH': 'community educational opportunity changes',

  // Demographic Labels
  'LABEL_ALL': 'all',
  'LABEL_B': 'Black',
  'LABEL_W': 'white',
  'LABEL_H': 'Hispanic',
  'LABEL_A': 'Asian',
  'LABEL_M': 'male',
  'LABEL_F': 'female',
  'LABEL_P': 'poor',
  'LABEL_NP': 'non-poor',
  'LABEL_FRL': 'free / reduced lunch program',

  // Gap Labels
  'LABEL_WB': 'Differences between white and Black',
  'LABEL_WH': 'Differences between white and Hispanic',
  'LABEL_WA': 'Differences between white and Asian',
  'LABEL_PN': 'Differences between poor and non-poor',
  'LABEL_MF': 'Differences between male and female',
  'LABEL_GAP': '$[demographic1] and $[demographic2]',

  // Region Labels
  'LABEL_COUNTIES': 'counties',
  'LABEL_DISTRICTS': 'school districts',
  'LABEL_SCHOOLS': 'schools',
  'LABEL_COUNTIES_SINGULAR': 'county',
  'LABEL_DISTRICTS_SINGULAR': 'school district',
  'LABEL_SCHOOLS_SINGULAR': 'school',

  'SUMMARY_AVG_LOW': '$[name] has low community educational opportunity because students scores are $[value] grade levels behind their grade level.',
  'SUMMARY_AVG_MID': '$[name] has average community educational opportunity because students scores close to their grade level.',
  'SUMMARY_AVG_HIGH': '$[name] has high community educational opportunity because students scores are $[value] grade levels ahead of their grade level.',
  'SUMMARY_GRD_LOW': '$[name] has low school-based opportunity because students only learn $[value] grade levels per year.',
  'SUMMARY_GRD_MID': '$[name] has average school-based opportunity because students learn $[value] grade levels per year.',
  'SUMMARY_GRD_HIGH': '$[name] has high school-based opportunity because students learn $[value] grade levels per year.',
  'SUMMARY_COH_LOW': 'Community educational opportunity is improving for $[name] because test scores have improved $[value] grade levels from 2009-2016.',
  'SUMMARY_COH_MID': 'Community educational opportunity is not changing for $[name] because test scores have changed minimally from 2009-2016.',
  'SUMMARY_COH_HIGH': 'Community educational opportunity is declining for $[name] because test scores have dropped $[value] grade levels from 2009-2016.',
  'SUMMARY_AVG_NONE': 'No community educational opportunity data for $[name].', 
  'SUMMARY_GRD_NONE': 'No school-based opportunity data for $[name].', 
  'SUMMARY_COH_NONE': 'No change in community educational opportunity data for $[name].', 

  'LOCATION_COMPARE_FEATURES_TITLE': 'Compare $[region]',
  'LOCATION_COMPARE_FEATURES': 'Select another place from the map, chart, or search to compare it with $[name].',
  'LOCATION_EXPORT_REPORT_TITLE': 'Export a Report',
  'LOCATION_EXPORT_REPORT': `Select one of the options below to export a PDF report or Powerpoint presentation about the educational opportunity in $[name].`,
  'LOCATION_DIFFERENCES_TITLE': 'Opportunity Differences',
  'LOCATION_DIFFERENCES': '',
  'LOCATION_SIMILAR_PLACES_TITLE': 'Similar $[region]',
  'LOCATION_SIMILAR_PLACES': `The following places are similar to $[name] based on size, socioeconomic status, and other factors:`,


  // Explainers
  'EXPLAINER_AVG': 'Shows the set of educational opportunities children have had from birth to the time they take the tests',
  'EXPLAINER_GRD': 'Shows how much students learn on average while they are in school',
  'EXPLAINER_COH': 'Indicates the extent to which a community is getting better at providing educational opportunities over time',
  'EXPLAINER_SES': '',
  'EXPLAINER_SEG': '',

  // Description of metric value for location
  'VALUE_AVG': 'Students score $[amount] grade levels $[aboveBehind] average. ',
  'VALUE_GRD': 'Test scores grow $[amount] grade levels each year. ',
  'VALUE_COH': 'Test scores $[risingFalling] $[amount] grade levels over time. ',
  'VALUE_SES': 'Socioeconomic status is $[aboveBelow] national average.',
  'VALUE_SEG': '',

  'VALUE_AVG_HIGH': 'students score <strong>$[value] grade levels above</strong> U.S. average.',
  'VALUE_AVG_MID': 'students test scores are at the national average.',
  'VALUE_AVG_LOW': 'students score <strong>$[value] grade levels below</strong> U.S. average.',
  'VALUE_GRD_HIGH': 'students learn <strong>$[value] more each grade</strong> than the U.S. average.',
  'VALUE_GRD_MID': 'students learn the same each grade as the U.S. average.',
  'VALUE_GRD_LOW': 'students learn <strong>$[value] less each grade</strong> than the U.S. average.',
  'VALUE_COH_HIGH': 'test scores are <strong>improving $[value] each year</strong>.',
  'VALUE_COH_MID': 'no change in test scores.',
  'VALUE_COH_LOW': 'test scores are <strong>declining $[value] each year</strong>.',

  'VALUE_SES_ULTRA_HIGH': 'socioeconomic status is <strong>very far above national average</strong>.',
  'VALUE_SES_VERY_HIGH': 'socioeconomic status is <strong>far above national average</strong>.',
  'VALUE_SES_HIGH': 'socioeconomic status is <strong>above national average</strong>.',
  'VALUE_SES_MID': 'socioeconomic status is <strong>about average</strong>.',
  'VALUE_SES_LOW': 'socioeconomic status is <strong>below national average</strong>.',
  'VALUE_SES_VERY_LOW': 'socioeconomic status is <strong>far below national average</strong>.',
  'VALUE_SES_ULTRA_LOW': 'socioeconomic status is <strong>very far below national average</strong>.',

  // 'VALUE_SEG': '',

  // Description of gap value for location
  'VALUE_AVG_GAP': 'Difference of $[amount] grade levels between $[gap] students.',
  'VALUE_GRD_GAP': 'Difference in growth $[increasedDecreased] $[amount] grade levels between $[gap] students.',
  'VALUE_COH_GAP': 'Difference in test scores $[increasedDecreased] $[amount] grade levels between $[gap] students.',
  'VALUE_SES_GAP': '',
  'VALUE_SEG_GAP': '',

  // Section Titles
  'TITLE_SES_AVG': 'Socioeconomic Status and Educational Opportunity',
  'TITLE_SES_GRD': 'Socioeconomic Status and School Performance',
  'TITLE_SES_COH': 'Socioeconomic Status and Changes in Opportunity',
  'TITLE_OPP_AVG': 'Differences in Opportunity',
  'TITLE_OPP_GRD': 'Differences in School Performance',
  'TITLE_OPP_COH': 'Differences in Changes of Opportunity',
  'TITLE_ACH_AVG': 'Gaps in Achievement',
  'TITLE_ACH_GRD': 'Gaps in Growth',
  'TITLE_ACH_COH': 'Gaps in Opportunity Changes',

  // Section Descriptions

  // Scatterplot Titles
  'SP_TITLE_AVG_SES': 'Community Educational Opportunity and Socioeconomic Status',
  'SP_TITLE_AVG_FRL': 'Community Educational Opportunity and % Free or Reduced Lunch Program ',
  'SP_TITLE_GRD_SES': 'School-based Opportunity and Socioeconomic Status',
  'SP_TITLE_GRD_FRL': 'School-based Opportunity and % Free or Reduced Lunch Program',
  'SP_TITLE_COH_SES': 'Changes in Community Educational Opportunity and Socioeconomic Status',
  'SP_TITLE_COH_FRL': 'Changes in Community Educational Opportunity and % Free or Reduced Lunch Program',
  
  'OP_TITLE_AVG': 'Achievement Differences Between $[dem1] and $[dem2]',
  'OP_TITLE_GRD': 'Growth Differences Between $[dem1] and $[dem2]',
  'OP_TITLE_COH': 'Change in Achievement Differences Between $[dem1] and $[dem2]',

  // Axis Names
  'AXIS_NAME_FRL_PCT': '% of students qualifying for free or reduced lunch program',
  'AXIS_NAME_SES': '',

  // Axis Labels
  'AXIS_AVG_ZERO': 'average\nperformance',
  'AXIS_AVG_LOW_SINGLE': '$[value] grade\nbehind',
  'AXIS_AVG_LOW': '$[value] grades\nbehind',
  'AXIS_AVG_HIGH_SINGLE': '$[value] grade\nahead',
  'AXIS_AVG_HIGH': '$[value] grades\nahead',

  'AXIS_GRD_ZERO': 'no\ngrowth',
  'AXIS_GRD_LOW_SINGLE': 'learned $[value]\ngrade level',
  'AXIS_GRD_LOW': 'learned $[value]\ngrade levels',
  'AXIS_GRD_HIGH_SINGLE': 'learned $[value]\ngrade level',
  'AXIS_GRD_HIGH': 'learned $[value]\ngrade levels',

  'AXIS_COH_ZERO': 'no change\nin test scores',
  'AXIS_COH_LOW_SINGLE': 'dropped $[value]\ngrade level',
  'AXIS_COH_LOW': 'dropped $[value]\ngrade levels',
  'AXIS_COH_HIGH_SINGLE': 'improved $[value]\ngrade level',
  'AXIS_COH_HIGH': 'improved $[value]\ngrade levels',

  'AXIS_AVG_GAP_ZERO': 'no gap\nin opportunity',
  'AXIS_AVG_GAP_LOW_SINGLE': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_LOW': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_HIGH_SINGLE': '$[value] grade level\ndifference',
  'AXIS_AVG_GAP_HIGH': '$[value] grade level\ndifference',

  'AXIS_GRD_GAP_ZERO': 'no\n difference',
  'AXIS_GRD_GAP_LOW': '-$[value] growth gap',
  'AXIS_GRD_GAP_HIGH': '$[value] growth gap',

  'AXIS_COH_GAP_ZERO': 'no\ndifference',
  'AXIS_COH_GAP_LOW': '-$[value]\n trend gap',
  'AXIS_COH_GAP_HIGH': '$[value]\ntrend gap',

  'AXIS_SES_ZERO': 'average socioeconomic status',
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

  // Intro Section
  'INTRO_TITLE': 'What type of educational opportunity would you like to explore?',
  'INTRO_DESCRIPTION': 'Using over 330 million test scores across the U.S., we have calculated $[avg], $[grd], and $[coh] to measure educational opportunity.',
  'SEARCH_PLACEHOLDER': 'Find a city, county, district, or school',
  'INTRO_CARD_DESCRIPTION_AVG': 'Average test scores are influenced by children`s opportunities to learn in their homes, in their neighborhoods, in the childcare, preschool, and after-school programs they attend, from their peers and friends, and in their schools. ',
  'INTRO_CARD_DESCRIPTION_GRD': 'Growth of test scores show how much students learn each year they are in school. It is a better measure of school quality and shows school-based opportunity.',
  'INTRO_CARD_DESCRIPTION_COH': 'Change in test scores show how test scores are improving or declining in an an area from 2009 - 2016.  This shows how community educational opportunity is changing.',

  // Map Legend (Mobile)
  'LEGEND_LOW': '◀ lower',
  'LEGEND_HIGH': 'higher ▶',
  'LEGEND_LOW_AVG': '◀ below grade level',
  'LEGEND_HIGH_AVG': 'above grade level ▶',
  'LEGEND_LOW_GRD': '◀ below 1 grade / year',
  'LEGEND_HIGH_GRD': 'above 1 grade / year ▶',
  'LEGEND_LOW_COH': '◀ scores dropping',
  'LEGEND_HIGH_COH': 'scores improving ▶',
  'LEGEND_LOW_SES': '◀ poorer',
  'LEGEND_HIGH_SES': 'richer ▶',
  'LEGEND_LOW_FRLP': '◀ lower poverty',
  'LEGEND_HIGH_FRLP': 'higher poverty ▶',

  'LEGEND_LOW_AVG_GAP': 'smaller gap',
  'LEGEND_HIGH_AVG_GAP': 'larger gap',
  'LEGEND_LOW_GRD_GAP': 'growth gap decreasing',
  'LEGEND_HIGH_GRD_GAP': 'growth gap increasing',
  'LEGEND_LOW_COH_GAP': 'trend gap decreasing',
  'LEGEND_HIGH_COH_GAP': 'trend gap increasing',

  'HELP_PANEL_TITLE': 'Help',
  'HELP_PANEL_HOW_TAB': 'How to explore',
  'HELP_PANEL_WHAT_TAB': 'What am I seeing',

  // What am I seeing conditionals
  'HP_*_*_*_*_*': 'You are viewing a $[view] showing the relationship between $[metric] and $[secondary] for $[demographic] students in U.S. $[region].',
  'HP_*_*_AVG_*_*': 'Community Educational Opportunity is reflected in average test scores. These scores are influenced by children\'s opportunities to learn in their homes, in their neighborhoods, in the childcare, preschool, and after-school programs they attend, from their peers and friends, and in their schools. They encompass the total set of educational opportunities available in a community.',
  'HP_*_*_GRD_*_*': 'Schools’ contributions to educational opportunity are reflected in the growth of children’s test scores while they are in school. The growth of test scores indicates how much students learn while in school. Because average test scores are influenced by many out-of-school opportunities, they reflect more than what children learn while they are in school. So growth of test scores is a better measure of school quality.',
  'HP_*_*_COH_*_*': 'The change in test scores indicates whether educational opportunities are rising or falling in a community. For example, rates of change tell us whether this year’s third graders are doing better than last year’s third graders. They reflect both changes in school quality and changes in other family and community features that provide opportunities for children.',

  // What am I seeing labels
  'HP_MAP': 'map',
  'HP_CHART': 'chart',
  'HP_SPLIT': 'map and chart',
  'HP_SES' : 'socioeconomic status',


  'WT_MAP': 'The map shapes show $[region] with colors representing $[metric] for $[demographic] students.',
  'WT_MAP_ZOOMED': 'The dots on the map show schools with colors representing $[metric] for the school.',

  'WT_CHART': 'The chart shows circles for $[region] sized relative to the number of students. Both the position of the circle on the vertical axis and color show their $[metric].',
  'WT_CHART_SES': 'Circles on the left represent an area with lower socioeconomic status where circles on the right correspond to areas with higher socioeconomic status.',

  'WT_CONTEXT_W': 'For white students',
  'WT_CONTEXT_B': 'For Black students',
  'WT_CONTEXT_H': 'For Hispanic students',
  'WT_CONTEXT_A': 'For Asian students',
  'WT_CONTEXT_M': 'For male students',
  'WT_CONTEXT_F': 'For female students',
  'WT_CONTEXT_P': 'For poor students',
  'WT_CONTEXT_NP': 'For non-poor students',

  'WT_AVG_NONGAP_HIGH_CONCEPT': 'High Community Educational Opportunity',
  'WT_AVG_NONGAP_LOW_CONCEPT': 'Low Community Educational Opportunity',
  'WT_GRD_NONGAP_HIGH_CONCEPT': 'High School-based Opportunity',
  'WT_GRD_NONGAP_LOW_CONCEPT': 'Low School-based Opportunity',
  'WT_COH_NONGAP_HIGH_CONCEPT': 'Improvement in Community Opportunity',
  'WT_COH_NONGAP_LOW_CONCEPT': 'Decrease in Community Opportunity Growth',


  'WT_AVG_NONGAP_HIGH': 'average scores above grade level',
  'WT_AVG_NONGAP_MID': 'average test scores at grade level',
  'WT_AVG_NONGAP_LOW': 'average scores below grade level',
  'WT_GRD_NONGAP_HIGH': 'students learn more than 1 grade level per year',
  'WT_GRD_NONGAP_MID': 'students learn 1 grade level per year',
  'WT_GRD_NONGAP_LOW': 'students learn less than 1 grade level per year',
  'WT_COH_NONGAP_HIGH': 'test scores are improving',
  'WT_COH_NONGAP_MID': 'test scores are not changing',
  'WT_COH_NONGAP_LOW': 'test scores are decreasing',

  'WT_AVG_GAP_HIGH': '$[demographic1] students\' test scores are higher than $[demographic2] students\'',
  'WT_AVG_GAP_MID': '$[demographic1] students\' test scores are equal to $[demographic2] students\'',
  'WT_AVG_GAP_LOW': '$[demographic1] students\' test scores are lower than $[demographic2] students\'',
  'WT_GRD_GAP_HIGH': '$[demographic1] students\' test scores grow more each year than $[demographic2] students\'',
  'WT_GRD_GAP_MID': '$[demographic1] students\' test scores grow the same amount as $[demographic2] students\'',
  'WT_GRD_GAP_LOW': '$[demographic1] students\' test scores grow less each year than $[demographic2] students\'',
  'WT_COH_GAP_HIGH': '$[demographic1] students\' test scores are improving more for $[demographic2] students over time\'',
  'WT_COG_GAP_MID': '$[demographic1] students\' test scores are changing the same over time as $[demographic2] students\'',
  'WT_COH_GAP_LOW': '$[demographic1] students\' test scores are improving less over time than $[demographic2] students\'',
  'WT_NO_DATA': 'No data',

  'WT_Q1': 'How are $[metric] calculated?',
  'WT_Q1_AVG': 'The average test scores are calculated from elementary school students in grades 3 through 8 from 2009 - 2016. See the <a href="#">FAQ</a> for more details.',
  'WT_Q1_GRD': 'The growth of test scores are calculated from the increase in test scores each year as the students progress through elementary school. See the <a href="#">FAQ</a> for more details.',
  'WT_Q1_COH': 'The changes in test scores are calculated from the increase or decrease of test scores for a place from 2009 - 2016. See the <a href="#">FAQ</a> for more details.',

  'WT_Q2': 'How does $[metric] show $[concept]',
  'WT_Q2_AVG': 'The elementary students\' test scores are influenced by opportunities to learn in their homes, in their neighborhoods, in the childcare, preschool, and after-school programs they attend, from their peers and friends, and in their schools. They encompass the total set of educational opportunities available in a community.',
  'WT_Q2_GRD': 'The growth of students\' test scores indicates how much students\' test scores improve over the span of one year. A larger increase in growth means schools are able to teach more in a year, meaning students attending the school have a higher school-based educational opportunity.',
  'WT_Q2_COH': 'The change in test scores indicates whether educational opportunities are rising or falling in a community. For example, rates of change tell us whether this year’s third graders are doing better than last year’s third graders. They reflect both changes in school quality and changes in other family and community features that provide opportunities for children.',

  'WT_Q3': 'What impacts the level of $[concept]?',
  'WT_Q3_AVG': 'As seen in the chart view, higher socioeconomic status in an area is correlated with a higher community educational opportunity.',
  'WT_Q3_GRD': 'The quality of schools\' ability to teach students.',
  'WT_Q3_COH': 'Educational policies put in place impact the change in educational opportunity over time. (e.g. Tennessee)',

  'WT_Q4': 'What does $[secondary] represent?',
  'WT_Q4_SES': 'Socioeconomic status (SES) is a broad concept that includes such factors as educational attainment, occupation, income, wealth, and deprivation.',
  'WT_Q4_SEG': '',
  'WT_Q4_FRLP': '',

  'WT_Q5': 'What does the difference in $[metric] between $[demographic1] students and $[demographic2] students show me?',
  'WT_Q5_AVG': '',
  'WT_Q5_GRD': '',
  'WT_Q5_COH': '',
  
  'WT_Q6': 'How does $[demographic1] students\' $[concept] compare to $[demographic2]?',
  'WT_Q6_AVG': '',
  'WT_Q6_GRD': '',
  'WT_Q6_COH': '',

  
  // How to use conditionals 
  'HOW_*_*_*_*_*': 'How to use content',

}

export default LANG