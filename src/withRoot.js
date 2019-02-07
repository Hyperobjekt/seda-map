import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import lightGreen from '@material-ui/core/colors/lightGreen';

// Theme for the tool
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: lightGreen,
  },
  typography: {
    useNextVariants: true,
  },
  shape: {
    borderRadius: 0,
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={ theme }>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component { ...props } />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;