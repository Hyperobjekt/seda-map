import { createMuiTheme } from '@material-ui/core/styles';

// Theme for the tool
const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#0e7cb4'
    },
    secondary: {
      main: '#FC0F44',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: "maisonneue-book,lato,helvetica neue,Arial,sans-serif,-apple-system",
    body2: {
      fontFamily: "maisonneue-book,lato,helvetica neue,Arial,sans-serif,-apple-system"
    },
    ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      .reduce((obj, item) => ({
        ...obj,
        [item]: {
          fontFamily: "sharpgrotesk-medium20, lato, helvetica neue, Arial, sans-serif, -apple-system"
        }
      }))
  },
  overrides: {
    MuiInputBase: {
      root: {
        'label + &': {
          marginTop: '20px!important',
        },
        '&:before': {
          borderBottomColor: 'rgba(0,0,0,0)!important'
        }
      },
      input: {},
      multiline: {
        padding: 0,
        marginBottom: 16
      }
    },
    MuiInput: {
      // Name of the rule
      input: {
        borderRadius: 0,
        lineHeight: 1,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        fontSize: 16,
        padding: '8px 8px',
        '&:focus': {
          borderColor: '#1383C6',
          boxShadow: '0 0 0 0.2rem #1383C633',
        },
      },
    },
    MuiCard: {
      root: { 
        boxShadow: '0 0 0 1px #e0e0e0, 0 2px 2px rgba(0,0,0,0.1)', 
      },
    },
    MuiSelect: {
      select: {
        borderRadius: 0,
      },
      icon: {
        right: 8
      }
    },
  },
  shape: {
    borderRadius: 0,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1920
    }
  }
});

export default materialTheme;