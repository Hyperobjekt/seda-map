import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ExplorerView from './explorer'
import SandboxView from './sandbox'
// import { MapEmbedView, ChartEmbedView } from '../components/organisms/Embed';
import SedaApp from '../modules/seda/SedaApp'
import theme from '../theme'
import { ThemeProvider, CssBaseline } from '@material-ui/core'

window.SEDA.trigger('app')

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Switch>
      {/* <Route exact path={`/`} render={() => (<Redirect to="/map/us/counties/avg/ses/all/3.5/38/-97"/>)} /> */}
      <Route exact path={`/`} component={SedaApp} />
      <Route exact path={`/v1.1.0`} component={SedaApp} />
      {/* <Route exact path={`/embed/chart/:highlightedState/:region/:xVar/:yVar/:zVar/:locations?`} component={ ChartEmbedView } /> */}
      {/* <Route exact path={`/embed/map/:region/:metric/:demographic/:zoom/:lat/:lon/:locations?`} component={ MapEmbedView } /> */}
      {/* <Route
        exact
        path={`/:view/:highlightedState/:region/:metric/:secondary/:demographic/:zoom/:lat/:lon/:locations?`}
        component={ExplorerView}
      /> */}
      {/* <Route exact path={`/sandbox`} component={SandboxView} /> */}
    </Switch>
  </ThemeProvider>
)

// #/embed/map/counties/avg/all/3.5/38/-97/:locations?

export default App
