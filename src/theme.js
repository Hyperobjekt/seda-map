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
    }
  },
  app: {
    panelWidth: 360,
    condensedPanelWidth: 72
  }
})

export default theme
