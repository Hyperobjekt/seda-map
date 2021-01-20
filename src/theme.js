import { createMuiTheme } from '@material-ui/core/styles'

const fontFamily =
  'maisonneue-book,lato,helvetica neue,Arial,sans-serif,-apple-system'
const boldFontFamily =
  'maisonneue-bold,lato,helvetica neue,Arial,sans-serif,-apple-system'
const headerFontFamily =
  'sharpgrotesk-medium20, lato, helvetica neue, Arial, sans-serif, -apple-system'
const condensedFontFamily =
  'sharpgrotesk-medium15, lato, helvetica neue, Arial, sans-serif, -apple-system'

const borderRadius = 3

const spacing = num => num * 8

const primary = {
  main: '#0071DB',
  highlight: '#F5F8FA',
  outline: 'rgba(0,113,219,0.2)'
}
const altDarkText = 'rgba(255,255,255,0.66)'
const highlightColor = '#EBFBFF'

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
      fontSize: '0.875rem'
    },
    body2: {
      fontSize: '0.75rem'
    },
    caption: {
      fontSize: '0.75rem'
    }
  },
  shape: {
    borderRadius: borderRadius
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1280,
      xl: 1400
    }
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
    boldType: {
      fontFamily: boldFontFamily,
      fontWeight: 'normal'
    },
    hint: {
      display: 'block',
      marginTop: spacing(1),
      padding: `${spacing(1.5)}px 0 ${spacing(0.5)}px`,
      fontStyle: 'italic',
      lineHeight: 1,
      borderTop: '1px dotted rgba(255,255,255,0.34)',
      color: altDarkText
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
    },
    MuiListSubheader: {
      root: {
        backgroundColor: '#fff',
        background: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: condensedFontFamily
      },
      sticky: {
        background: '#fff',
        backgroundColor: '#fff'
      }
    }
  },
  app: {
    panelWidth: 360,
    fullPanelWidth: 384,
    condensedPanelWidth: 80,
    boldFont: boldFontFamily,
    darkBackground: 'rgba(3, 18, 50, 0.94)',
    darkText: '#fff',
    altDarkText: altDarkText,
    aboveColor: '#40B875',
    belowColor: '#57A5FF',
    aboveColorAlt: '#40B875',
    belowColorAlt: '#57A5FF',
    highlightColor: highlightColor,
    highlightColorAlt: '#cff5ff',
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
