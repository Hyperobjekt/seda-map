import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import ExplorerView from './explorer'
import SandboxView from './sandbox';
import withRoot from '../withRoot';

const App = () => (
  <Switch>
    <Route exact path={`/`} render={() => (<Redirect to="/map/us/counties/avg/ses/all/3.5/38/-97"/>)} />
    <Route exact path={`/:view/:highlightedState/:region/:metric/:secondary/:demographic/:zoom/:lat/:lon/:locations?`} component={ ExplorerView } />
    <Route exact path={`/sandbox`} component={ SandboxView } />
  </Switch>
)

export default withRoot(App)
