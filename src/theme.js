import { createMuiTheme } from '@material-ui/core/styles'

const fontFamily =
  'maisonneue-book,lato,helvetica neue,Arial,sans-serif,-apple-system'
const headerFontFamily =
  'sharpgrotesk-medium20, lato, helvetica neue, Arial, sans-serif, -apple-system'
const condensedFontFamily =
  'sharpgrotesk-medium15, lato, helvetica neue, Arial, sans-serif, -apple-system'

const borderRadius = 3

const spacing = num => num * 8

const primary = { main: '#0071DB', highlight: '#EBFBFF' }

// Theme for the tool
const theme = createMuiTheme({
  palette: {
    primary: primary,
    secondary: {
      main: '#ff003e'
    },
    text: {
      primary: '#031232',
      secondary: '#5d5d5d',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    }
  },
  typography: {
    color: '#031232',
    fontFamily: fontFamily,
    h1: {
      fontSize: '2.4rem',
      fontFamily: headerFontFamily
    },
    h2: {
      fontSize: '2.1rem',
      fontFamily: headerFontFamily
    },
    h3: {
      fontSize: '1.8rem',
      fontFamily: headerFontFamily
    },
    h4: {
      fontSize: '1.5rem',
      fontFamily: headerFontFamily
    },
    h5: {
      fontSize: '1.2rem',
      fontFamily: headerFontFamily
    },
    h6: {
      fontFamily: headerFontFamily
    },
    button: {
      fontFamily: condensedFontFamily,
      fontSize: '.875rem',
      letterSpacing: '0.066em'
    },
    body1: {
      fontSize: '1em'
    },
    body2: {
      fontSize: '0.875em'
    },
    caption: {
      fontSize: 12
    }
  },
  shape: {
    borderRadius: borderRadius
  },
  mixins: {
    fillSpace: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%'
    },
    activeListButton: {
      background: primary.highlight,
      color: primary.main,
      borderRadius: borderRadius,
      '&:before': {
        position: 'absolute',
        content: '""',
        width: spacing(0.5),
        top: spacing(2),
        bottom: spacing(2),
        display: 'block',
        background: primary.main,
        left: spacing(2.5),
        borderRadius: borderRadius
      }
    }
  },
  overrides: {
    MuiIconButton: {
      root: {
        borderRadius: borderRadius
      }
    },
    MuiExpansionPanel: {
      root: {
        margin: 0,
        '&$expanded': {
          marginTop: 0,
          marginBottom: 0
        }
      }
    },
    MuiExpansionPanelSummary: {
      content: { margin: 0 }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: 'rgba(3, 18, 50, 0.94)',
        fontSize: 12
      },
      arrow: {
        color: 'rgba(3, 18, 50, 0.94)'
      }
    }
  },
  app: {
    panelWidth: 360,
    condensedPanelWidth: 72,
    darkBackground: 'rgba(3, 18, 50, 0.94)',
    altDarkText: 'rgba(255,255,255,0.66)',
    aboveColor: '#40B875',
    belowColor: '#57A5FF',
    aboveColorAlt: '#40B875',
    belowColorAlt: '#57A5FF',
    selectedColors: [
      '#F46800',
      '#8C1AF4',
      '#B2002A',
      '#F84EBF',
      '#3F00B3',
      '#FF0C0C'
    ]
  }
})

export default theme
